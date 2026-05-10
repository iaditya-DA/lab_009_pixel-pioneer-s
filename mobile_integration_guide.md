
# Mobile API Integration Guide (Kotlin/Android)

This guide explains how to consume your deployed Next.js APIs (`https://monastery-360-27tl.vercel.app/`) in a Kotlin Android application.

## 1. CORS vs Mobile Apps
**Good News:** You generally **do not** need to worry about CORS (Cross-Origin Resource Sharing) when calling APIs from a native mobile app (Android/iOS).

- **Why?** CORS is a security feature enforced by *web browsers* to prevent malicious websites from calling APIs on other domains.
- **Native Apps:** Native HTTP clients (like OkHttp, Retrofit) are not browsers. They do not send the `Origin` header by default, and they do not respect the browser's CORS policy. Your server will simply see a request and respond to it.

> **Note:** If you were building a mobile *website* or a hybrid app using a WebView that behaves like a browser, CORS would matter. But for a native Kotlin app using Retrofit, it will work fine.

## 2. Base URL Setup
Your base URL is:
```text
https://monastery-360-27tl.vercel.app/api/
```
*(Note the `/api/` suffix, which is usually the root for your API routes)*

## 3. Library Selection
We recommend using **Retrofit** and **OkHttp** for networking in Android.

### Add Dependencies (`build.gradle.kts` :app)
```kotlin
dependencies {
    // Retrofit
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0") // Or kotlinx.serialization
    // OkHttp (Logging Interceptor is great for debugging)
    implementation("com.squareup.okhttp3:logging-interceptor:4.11.0")
}
```

## 4. Implementation Example

### Step A: Create API Interface
Define your endpoints exactly as they are in your Next.js `app/api/...` folder.

```kotlin
interface MonasteryApiService {

    // Example: app/api/get-monastery/route.ts
    // GET https://monastery-360-27tl.vercel.app/api/get-monastery
    @GET("get-monastery")
    suspend fun getMonasteries(): List<Monastery>

    // Example: app/api/hotels/[id]/route.ts
    @GET("hotels/{id}")
    suspend fun getHotelById(@Path("id") id: String): Hotel

    // Example: POST app/api/book-hotel/route.ts
    @POST("book-hotel")
    suspend fun bookHotel(@Body bookingRequest: BookingRequest): BookingResponse
}
```

### Step B: Create Network Client (Singleton)
```kotlin
object NetworkModule {
    private const val BASE_URL = "https://monastery-360-27tl.vercel.app/api/"

    private val client = OkHttpClient.Builder()
        .addInterceptor(HttpLoggingInterceptor().apply {
             level = HttpLoggingInterceptor.Level.BODY
        })
        .build()

    val api: MonasteryApiService = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(client)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(MonasteryApiService::class.java)
}
```

### Step C: Usage in ViewModel/Repository
```kotlin
class MonasteryViewModel : ViewModel() {
    fun fetchMonasteries() {
        viewModelScope.launch {
            try {
                val monasteries = NetworkModule.api.getMonasteries()
                Log.d("API_SUCCESS", "Got ${monasteries.size} monasteries")
            } catch (e: Exception) {
                Log.e("API_ERROR", "Error: ${e.message}")
            }
        }
    }
}
```

## 5. Handling Authentication (NextAuth)
Since your app uses NextAuth, you might need to handle sessions.
- **Public APIs:** (e.g., viewing public monasteries) usually don't require auth. They will work immediately.
- **Protected APIs:** If an API route uses simple cookie-based NextAuth logic (checking `getServerSession`), it might fail because mobile apps don't automatically manage cookies like browsers.

**Solution for Mobile Auth:**
1.  **Login API:** You might need to build a specific API route that accepts credentials and returns a JWT (JSON Web Token) if `NextAuth` is strictly cookie-based.
2.  **Shared Cookies:** Alternatively, you can grab the session cookie (usually `next-auth.session-token`) upon login and manually attach it to OkHttp requests.
    ```kotlin
    // Adding cookie to request manually
    val request = chain.request().newBuilder()
        .addHeader("Cookie", "next-auth.session-token=$yourToken")
        .build()
    ```


## 6. API Endpoint Reference
Here is a list of available API endpoints you can call. Replace `[id]` or `[monasteryId]` with actual IDs.

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/signin` | (Handled by NextAuth) |
| `POST` | `/signup` | Register a new user |
| `GET` | `/userprofile` | Get current user profile |

### Monasteries
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/monastries` | List all monasteries |
| `GET` | `/monastries/[id]` | Get specific monastery details |
| `GET` | `/get-monastery` | (Alternative) List monasteries |
| `GET` | `/monastery-view/[id]` | Get monastery view details |
| `GET` | `/monasteryImg` | Get monastery images |
| `POST` | `/liked-monastery` | Like a monastery |

### Events
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/events` | List all events |
| `GET` | `/events/get-events` | Get all events (Alternative) |
| `GET` | `/events/[id]` | Get specific event details |
| `GET` | `/events/event-by-monastries/[id]` | Get events for a specific monastery |
| `POST` | `/create-event` | Create a new event |
| `POST` | `/create-tickets` | Create tickets for an event |

### Hotels & Booking
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/hotels` | List all hotels |
| `GET` | `/hotels/[id]` | Get hotel details |
| `GET` | `/hotels/monastery/[id]` | Get hotels near a monastery |
| `GET` | `/get-hotel` | (Alternative) List hotels |
| `POST` | `/book-hotel` | Book a hotel room |
| `POST` | `/razorpay/order` | Create Razorpay order for payment |

### Digital Archives & Tours
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/digitalarchives` | List digital archives |
| `GET` | `/digitalArchives-monastery/[monasteryId]` | Get archives for a monastery |

### Utilities
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/district` | List districts |
| `POST` | `/chat-bot` | AI Chatbot interaction |
| `POST` | `/plan` | Generate AI Travel Plan |
