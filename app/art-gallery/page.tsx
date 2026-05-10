"use client";
import React from "react";
import { ZoomIn } from "lucide-react";
const images =[
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292246/dub3_dbiq0z.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292246/dub2_trhmn8.webp",

  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292247/dub6_qkas2r.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292248/dub5_kfkosv.webp",

  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292281/sa1_fp8fue.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292281/sa2_p5tnma.webp",

  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292282/sa4_fjbfqy.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292282/sa3_f3qkzd.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292283/sa5_yvatzh.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292283/sa7_zxxq5i.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292283/sa6_vuw8ay.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292283/sa8_dgik66.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292257/laq7_dk4ljx.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292257/laq6_mofjbq.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292255/laq1_mcntzy.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292255/laq2_z52qga.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292256/laq5_nhks59.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292263/01img_r9vmbl.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292264/02Img_s6btyf.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292264/03Img_xywfwe.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292266/06Img_zsugyw.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292266/0Img_cxslet.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292266/04Img_nibcua.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292279/05tse_hqlbb8.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292279/03tse_uthukh.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292278/02tse_xwscm1.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292276/saga4_jtqgcr.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292275/saga2_vxai1o.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292275/saga3_unbnbe.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292269/dung3_emdu7u.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292268/dung1_xmj9gu.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292267/dung_j9mtmk.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292281/vraj4_xy5yrt.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292280/vraj3_odikwl.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292280/vraj_ordbp6.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292274/mahak3_pkjwue.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292273/mahak2_rga8ka.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292272/mahak1_kshs8e.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292252/detor_erw7wg.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292251/detor1_lqzsgx.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292249/detor2_qumwni.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292250/pang_kewzmb.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292246/pang2_i33cwr.webp",

  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292246/sing_svr10v.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292250/losar2_abtqkz.webp",

  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292247/regular_tkdfsl.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292246/regulat_n40yuh.webp",

  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292284/bhum_gnrypj.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292284/01a_eiiofd.webp",

  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292285/panj_m3mkqp.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292297/lo2_fo7mnz.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292285/regu1_huh2qh.webp",

  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292285/lo1_vm259g.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292284/legu2_oixfuz.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292260/phodo3_gus3yw.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292259/phodo1_diycok.webp",

  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292265/s1_gqeeqt.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292261/s2_jlwmp9.webp",

  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292261/s2_jlwmp9.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292258/003_ozyjro.webp",

  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292259/l3_gcfctx.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292259/l2_vbufyr.webp",

  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292258/002_n28nez.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292258/001_aqsiol.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292245/dub1_gek2ra.webp",
  
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292257/laq8_sxtv6p.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292256/laq4_szjysu.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292262/r4_m1gssx.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292276/s03_ubnbmt.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292278/s01_f7z17a.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292278/saga02_ylg9bw.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292270/03losar_zssjnq.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292271/05losar_zx7s6p.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292252/g6_pldbq1.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292251/g5_ne3zjw.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292251/g4_srqgyo.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292251/g3_sbabud.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292249/g2_l1nvcr.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292248/g1_uepch9.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292246/pang2_i33cwr.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292250/pang_kewzmb.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292246/regulat_n40yuh.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292247/regular_tkdfsl.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292251/detor1_lqzsgx.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292252/detor_erw7wg.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292254/k1_rffmny.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292254/k6_zdma0z.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292254/k5_zrgolc.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292252/k2_e8vnca.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292253/k3_mbziba.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292253/k4_usgruo.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292261/r2_kervhx.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292262/r1_qh8x7d.webp",
  "https://res.cloudinary.com/djeospbqe/image/upload/v1764292261/r3_xnhat7.webp"
]
export default function GalleryPage() {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-extrabold mb-10 text-center tracking-wide">
        Art <span className="text-purple-600">Gallery</span>
      </h1>

      {/* Masonry Layout */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-5 space-y-5">
        {images.map((url, idx) => (
          <div
            key={idx}
            className="relative mb-5 break-inside-avoid overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 group"
          >
            {/* Image */}
            <img
              src={url}
              alt={`Art ${idx}`}
              className="w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
              <ZoomIn className="text-white size-10 animate-pulse"/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
