"use client";
import Image from "next/image";
export default function AboutSikkim() {
    return (
        <section className="w-full bg-white text-gray-900 font-sans">

            {/* Hero Section */}
            <div
                className="relative w-full h-[420px] flex items-center justify-center bg-cover bg-center shadow-md"
                style={{ backgroundImage: `url('/images/01sikkim.jpg')` }}
            >
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative text-center">
                    <h1 className="text-white text-6xl font-extrabold tracking-wider drop-shadow-xl uppercase">
                        About Sikkim
                    </h1>
                    <p className="text-white text-lg tracking-wide mt-3 font-medium">
                        Where Nature Smiles & Culture Shines
                    </p>
                </div>
            </div>

            {/* Container */}
            <div className="max-w-6xl mx-auto py-14 px-6 space-y-14 leading-relaxed text-lg">

                {/* Intro Card */}
                <div className="bg-green-50/70 rounded-2xl p-8 shadow-sm border border-green-200">
                    <p className="font-medium">
                        Sikkim is a breathtaking Himalayan state in Northeast India, known for its peaceful
                        monasteries, snow-capped mountains, organic farming, and vibrant cultural heritage.
                        With its clean environment, friendly communities, and stunning natural beauty, Sikkim
                        stands as one of the most serene travel destinations in India.
                    </p>
                </div>

                {/* History Section */}
                <section className="space-y-6">
                    <h2 className="text-4xl font-bold text-green-700 border-l-8 border-green-600 pl-4">
                        History & Culture
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <p className="leading-relaxed text-lg">
                            Sikkim became the 22nd state of India in 1975 and is home to three major ethnic
                            communities — <strong>Lepchas, Bhutias, and Nepalis</strong>. With over 200
                            monasteries, the state is a major center for Buddhist teachings and traditional art.
                            The famous Rumtek and Pemayangtse monasteries attract monks, historians, and
                            spiritual seekers from around the world.
                            The Kingdom of Sikkim was founded by the Namgyal dynasty in the 17th century. It was ruled by Buddhist priest-kings known as the Chogyal. It became a princely state of the British Indian Empire in 1890. Following Indian independence, Sikkim continued its protectorate status with the Union of India after 1947 and the Republic of India after 1950. It enjoyed the highest literacy rate and per capita income among Himalayan states.
                            Modern Sikkim is a multiethnic and multilingual Indian state. The predominant religion is Hinduism, with a significant Vajrayana Buddhist minority. Sikkim's economy is largely dependent on agriculture and tourism.
                        </p>

                        <Image
                            src="/images/4sikkim.jpg"
                            alt="Rumtek Monastery"
                            width={1000}
                            height={400}
                            className="rounded-2xl shadow-xl object-cover"
                        />
                    </div>
                </section>

                {/* Tourist Places */}
                <section className="space-y-6">
                    <h2 className="text-4xl font-bold text-green-700 border-l-8 border-green-600 pl-4">
                        Major Tourist Attractions
                    </h2>

                    <ul className="list-disc ml-8 space-y-2 font-medium">
                        <li>Gangtok – Capital city known for MG Marg & local markets</li>
                        <li>Tsomgo Lake – A stunning glacial lake at 12,300 ft</li>
                        <li>Nathula Pass – Historic Indo-China border trade route</li>
                        <li>Yumthang Valley – Popularly known as the Valley of Flowers</li>
                        <li>Gurudongmar Lake – Among the highest lakes in the world</li>
                    </ul>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <Image
                            src="/images/5sikkim.jpg"
                            alt="Yumthang Valley"
                            width={600}
                            height={400}
                            className="rounded-2xl shadow-xl object-cover"
                        />
                        <Image
                            src="/images/02sikkim.webp"
                            alt="Tsomgo Lake"
                            width={600}
                            height={400}
                            className="rounded-2xl shadow-xl object-cover"
                        />
                    </div>
                </section>


                {/* Why Special */}
                <section className="space-y-4">
                    <h2 className="text-4xl font-bold text-green-700 border-l-8 border-green-600 pl-4">
                        Why Sikkim is Special?
                    </h2>
                    <ul className="list-disc ml-8 space-y-3 text-lg font-semibold">
                        <li>Unmatched natural beauty & biodiversity</li>
                        <li>Rich spiritual & cultural heritage</li>
                        <li>Clean, peaceful, and safe environment</li>
                        <li>Eco-friendly tourism & organic agriculture</li>
                    </ul>
                </section>
                {/* Economy */}
                <section className="space-y-6">
                    <h2 className="text-4xl font-bold text-green-700 border-l-8 border-green-600 pl-4">
                        Economy & Environment
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <p className="leading-relaxed text-lg">
                            Sikkim is India’s first 100% organic state and a global example of sustainable
                            development. Its economy is powered mainly by tourism, agriculture, and hydropower.
                            Strong environmental laws, plastic bans, and eco-friendly tourism initiatives make
                            Sikkim a role model for clean and green living.
                            The economy of Sikkim, a state in northeastern India, has a significantly agricultural economy. Although having mountainous terrain, Sikkim has managed to sustain its agricultural economy through organic farming. The state of Sikkim was declared as the only 100 per cent organic state in 2016. </p>
                        <Image
                            src="/images/environmentSikkim.jpg"
                            alt="Rumtek Monastery"
                            width={1000}
                            height={400}
                            className="rounded-2xl shadow-xl object-cover"
                        />
                    </div>
                </section>
                {/* Geography Section */}
                <section className="space-y-4">
                    <h2 className="text-4xl font-bold text-green-800 border-l-8 border-green-600 pl-4">
                        Geography & Climate
                    </h2>
                    <p>
                        Sikkim is surrounded by Nepal, Bhutan, Tibet, and West Bengal, with diverse landscapes
                        ranging from subtropical valleys to Mount Kanchenjunga, the world’s third-highest peak.
                        The state experiences pleasant weather year-round and is a hotspot for trekking,
                        wildlife sighting, and adventure activities.
                    </p>
                </section>

                {/* Festivals & Traditions */}
                {/* <section className="space-y-4">
                    <h2 className="text-4xl font-bold text-green-800 border-l-8 border-green-600 pl-4">Festivals & Traditions</h2>
                    <p>
                        Sikkim celebrates vibrant festivals like Losar, Saga Dawa, Drukpa Tsheshi, and Pang Lhabsol.
                        These festivals reflect the deep connection between culture, religion, and the Himalayan environment,
                        with colorful mask dances, traditional music, and rituals performed in monasteries.
                    </p>
                    <img
                        src="/images/cham-dance.jpg"
                        alt="Cham Dance Festival"
                        className="rounded-2xl shadow-xl w-full object-cover"
                    />
                </section> */}
                <section className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
                    <div className="flex flex-col space-y-4 md:w-1/2">
                        <h2 className="text-4xl font-bold text-green-800 border-l-8 border-green-600 pl-4">Festivals & Traditions</h2>
                        <p>
                            Sikkim celebrates vibrant festivals like Losar, Saga Dawa, Drukpa Tsheshi, and Pang Lhabsol.
                            These festivals reflect the deep connection between culture, religion, and the Himalayan environment,
                            with colorful mask dances, traditional music, and rituals performed in monasteries.
                        </p>
                        {/* Extra festival text yaha daal sakte ho: */}
                        <p>
                            Major mask dance festivals (Cham dances) are held at monasteries such as Rumtek and Pemayangtse, attracting devotees and tourists alike. The Pang Lhabsol festival is unique to Sikkim, honoring Mount Khangchendzonga through vibrant performances and rituals.
                        </p>
                    </div>
                    <div className="flex flex-col space-y-4 md:w-1/2">
                        <img
                            src="/images/sikkimDance2.webp"
                            alt="Cham Dance Festival"
                            className="rounded-2xl shadow-xl object-cover w-full h-64"
                        />
                        <img
                            src="/images/sikkimDance.webp" // apne actual image ka naam rakhna
                            alt="Pang Lhabsol Festival"
                            className="rounded-2xl shadow-xl object-cover w-full h-64"
                        />
                    </div>
                </section>


                {/* Wildlife & Biodiversity */}
                <section className="flex flex-row items-center space-x-8">
                    <Image
                        src="/images/redPanda.webp"
                        alt="Red Panda"
                        width={400}
                        height={300}
                        className="rounded-2xl shadow-xl object-cover flex-shrink-0"
                    />
                    <div>
                        <h2 className="text-4xl font-bold text-green-800 border-l-8 border-green-600 pl-4">
                            Wildlife & Biodiversity
                        </h2>
                        <p>
                            Sikkim is home to over 4,500 species of flowering plants, 550 species of birds, and rare wildlife
                            including the Red Panda, Snow Leopard, and Himalayan Black Bear. The state’s national parks
                            like Khangchendzonga National Park (UNESCO World Heritage Site) are globally recognized for
                            biodiversity preservation.
                        </p>
                    </div>
                </section>
                <section className="space-y-4">
                    <h2 className="text-4xl font-bold text-green-800 border-l-8 border-green-600 pl-4">
                        Education & Modern Development
                    </h2>
                    <p>
                        Sikkim has achieved remarkable progress in education, technology, and infrastructure.
                        With high literacy rates and student scholarships, the state promotes learning and innovation.
                        Modern road networks, renewable energy projects, and digital facilities make Sikkim both
                        future-ready and environmentally conscious.
                    </p>
                    <img
                        src="/images/sikkim-university.jpg"
                        alt="Sikkim University"
                        className="rounded-2xl shadow-xl w-full object-cover"
                    />
                </section>
                <p className="text-center text-xl font-semibold text-green-700 pt-10 pb-4">
                    🌿 <em>Sikkim — A land of peace, purity, and breathtaking beauty</em> 🌿
                </p>
            </div>
        </section>
    );
}
