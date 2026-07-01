
import React from 'react';
import { Users, Award, Globe, Rocket, Glasses } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20">
      {/* Hero Section - Full Width Background */}
      <div className="w-full px-6 mb-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mb-8 shadow-2xl shadow-purple-500/20 rotate-3 hover:rotate-6 transition-transform">
              <Glasses className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tight">
            КрасоМир
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Мы объединяем искусство фотографии и мощь искусственного интеллекта, чтобы каждый мог создавать шедевры в один клик.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
           <div className="bg-[#151921] p-10 rounded-[32px] border border-white/5 hover:border-purple-500/30 transition-all hover:bg-[#1A1F29] group">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <Rocket className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Миссия</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Демократизация профессиональной обработки. Мы верим, что технологии должны усиливать творческий потенциал человека, а не заменять его. Наша цель — дать инструменты студийного уровня каждому.
              </p>
           </div>
           
           <div className="bg-[#151921] p-10 rounded-[32px] border border-white/5 hover:border-blue-500/30 transition-all hover:bg-[#1A1F29] group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <Globe className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Масштаб</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Запущенный в 2024 году, КрасоМир уже помог более 500,000 пользователям создать миллионы уникальных изображений. Мы базируемся в Иркутске, но работаем на весь мир.
              </p>
           </div>
        </div>

        <div className="border-t border-white/10 pt-20">
           <h2 className="text-2xl font-bold mb-10 text-center text-white">Юридическая информация</h2>
           <div className="bg-[#0B0E14] rounded-3xl border border-white/10 p-8 md:p-12 font-mono text-sm text-gray-400 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                 <div>
                    <span className="block text-gray-600 text-xs uppercase tracking-wider mb-2">Полное наименование</span>
                    <p className="text-white text-base">Компания «Два А — Цифровые Решения»</p>
                    <p className="mt-1 opacity-50">ASPRO Limited Liability Company</p>
                 </div>
                 <div>
                    <span className="block text-gray-600 text-xs uppercase tracking-wider mb-2">Сокращенное наименование</span>
                    <p className="text-white text-base">«Два А — Цифровые Решения»</p>
                    <p className="mt-1 opacity-50">ASPRO LLC</p>
                 </div>
              </div>
              
              <div className="h-px bg-white/10 my-8"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                 <div>
                    <span className="block text-gray-600 text-xs uppercase tracking-wider mb-2">Email</span>
                    <p className="text-white">billing@asprollc.ru</p>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                       <span>ИНН</span>
                       <span className="text-white">7708427184</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                       <span>КПП</span>
                       <span className="text-white">770801001</span>
                    </div>
                    <div className="flex justify-between">
                       <span>ОГРН</span>
                       <span className="text-white">1237700834139</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
