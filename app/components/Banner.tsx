"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Banner() {
  return (
    <div className="w-full h-80 bg-gray-100 rounded-xl overflow-hidden mb-8  min-w-[650px]">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        className="h-full"
      >
        <SwiperSlide className="relative flex flex-col justify-center px-12 bg-blue-600 text-white rounded-xl overflow-hidden min-h-[256px]">
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />

          <div className="relative z-10 w-full max-w-4xl">
            <span className="inline-block bg-white/20 backdrop-blur-md text-[10px] px-2.5 py-1 mt-5 rounded-md mb-4 font-bold tracking-widest">
              NOTICE
            </span>

            <h3 className="text-3xl md:text-4xl font-black leading-tight tracking-tighter mb-4">
              새로운 기능이
              <br /> 업데이트되었습니다!
            </h3>

            <p className="text-sm md:text-base text-white/80 max-w-lg leading-relaxed">
              실시간 인기글 피드와 대시보드 통계 기능이 추가되어,
              <br className="hidden md:block" />
              더욱 편리한 커뮤니티 활동이 가능해졌습니다.
            </p>

            <button className="mt-8 px-5 py-2 bg-white text-blue-600 rounded-lg text-sm font-bold shadow-lg hover:bg-blue-50 transition-all">
              자세히 알아보기
            </button>
          </div>
        </SwiperSlide>
        <SwiperSlide className="relative flex flex-col justify-center px-12 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl overflow-hidden min-h-[256px]">
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />

          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300/10 rounded-full blur-3xl" />

          <div className="relative z-10 w-full max-w-4xl">
            <span className="inline-block bg-white/15 backdrop-blur-md text-[10px] px-2.5 py-1 mt-5 rounded-md mb-4 font-bold tracking-widest border border-white/20">
              GUIDE
            </span>

            <h3 className="text-3xl md:text-4xl font-black leading-tight tracking-tighter mb-4">
              게시판 이용 수칙 안내
            </h3>

            <p className="text-sm md:text-base text-white/80 max-w-lg leading-relaxed">
              모두가 즐거운 커뮤니티를 위해 기본 규칙을 지켜주세요
            </p>

            <button className="mt-8 px-5 py-2 bg-white text-purple-600 rounded-lg text-sm font-bold shadow-md hover:bg-purple-50 transition-all">
              자세히 보기
            </button>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
