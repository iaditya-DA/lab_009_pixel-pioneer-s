
# Mobile Authentication Guide (Kotlin/Android)

This guide details how to implement authentication in your Android app using the deployed Next.js backend (`https://monastery-360-27tl.vercel.app/`).

## Overview
Your backend uses **NextAuth.js** with JWT-based sessions.
- **Provider:** Credentials (Email/Password) & Google
- **Session Token:** Stored in a secure HttpOnly cookie (`next-auth.session-token`).
- **Challenge for Mobile:** Mobile apps (Retrofit/OkHttp) don't automatically store cookies like browsers do. You must capture this cookie and send it back with every subsequent request.

---

## 1. Credentials Login (Email/Password)

To log in a user, you need to make a POST request to the NextAuth sign-in endpoint.

**Endpoint:** `POST https://monastery-360-27tl.vercel.app/api/auth/callback/credentials`

### Request Body (`x-www-form-urlencoded` or `json`)
Note: NextAuth typically expects form data, but JSON often works if configured. For standard NextAuth, send a form-encoded body:

- `email`: user@example.com
- `password`: yourpassword
- `redirect`: false (Important! keeps the response JSON-friendly)
- `csrfToken`: (Optional, but often required. See below "CSRF Handling")

### Step-by-Step Implementation

#### A. Fetch CSRF Token (First Step)
NextAuth requires a CSRF token for security.
**GET** `https://monastery-360-27tl.vercel.app/api/auth/csrf`

**Response:**
```json
{
  "csrfToken": "15340134..."
}
```

#### B. Perform Login Request
Use the CSRF token to login.

```kotlin
// Define form fields
val formBody = FormBody.Builder()
    .add("email", "user@example.com")
    .add("password", "secret123")
    .add("redirect", "false")
    .add("csrfToken", csrfToken) // from Step A
    .build()

val request = Request.Builder()
    .url("https://monastery-360-27tl.vercel.app/api/auth/callback/credentials")
    .post(formBody)
    .build()

val response = client.newCall(request).execute()
```

#### C. Capture the Session Cookie (CRITICAL)
If login is successful (Status 200), the response headers will contain a `Set-Cookie` header.
- Look for `next-auth.session-token` (or `__Secure-next-auth.session-token` on HTTPS).
- **Save this cookie string securely** (e.g., EncryptedSharedPreferences).

---

## 2. Google Login (Mobile)
Since NextAuth uses browser redirects for Google, you cannot simply "POST" credentials.

**Recommended Mobile Strategy:**
1.  Use the native **Android Google Sign-In SDK** to authenticate the user and get an `id_token`.
2.  **Verify on Backend:** You would typically send this `id_token` to a custom API route (e.g., `/api/auth/google-mobile`) which validates it and issues a session cookie.
    *   *Current State:* Your backend currently only supports the web-based Google flow.
    *   *Workaround:* Use a **Chrome Custom Tab** to open the web login page (`/signin`), let the user login there, and intercept the cookie or redirect URL callback.

---

## 3. Making Authenticated Requests
Once you have the `next-auth.session-token` cookie from Step 1C, you must attach it to **every** protected API call.

```kotlin
// Create an Interceptor to add the cookie automatically
class CookieInterceptor(private val sessionToken: String) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val original = chain.request()

        val authorizedRequest = original.newBuilder()
            .addHeader("Cookie", "next-auth.session-token=$sessionToken")
            // Note: Secure cookie might be named __Secure-next-auth.session-token
            .build()

        return chain.proceed(authorizedRequest)
    }
}
```

**Applying the Interceptor:**
```kotlin
val client = OkHttpClient.Builder()
    .addInterceptor(CookieInterceptor(savedToken))
    .build()
```

---

## 4. Protected API Categories
Use the authenticated client for these routes:
- **Booking Hotels:** `POST /api/book-hotel`
- **Creating Events:** `POST /api/create-event`
- **User Profile:** `GET /api/userprofile`
- **History/Likes:** `POST /api/liked-monastery`

**Public APIs (No Cookie Needed):**
- `GET /api/monastries` (List View)
- `GET /api/events` (List View)
- `GET /api/hotels` (List View)

---

## Summary Checklist
1.  [ ] **GET** `/api/auth/csrf` to get token.
2.  [ ] **POST** `/api/auth/callback/credentials` with email, password, csrfToken.
3.  [ ] **Extract** `Set-Cookie` header from response.
4.  [ ] **Store** the session token securely.
5.  [ ] **Attach** "Cookie" header to all subsequent API requests.
