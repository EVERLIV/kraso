
import React from 'react';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';

const JOBS = [
  {
    title: "Senior Full Stack Developer",
    dept: "Engineering",
    type: "Полная занятость",
    loc: "Москва / Гибрид",
  },
  {
    title: "AI Researcher (CV/ML)",
    dept: "R&D",
    type: "Полная занятость",
    loc: "Удаленно",
  },
  {
    title: "Product Designer",
    dept: "Design",
    type: "Полная занятость",
    loc: "Москва",
  },
  {
    title: "Community Manager",
    dept: "Marketing",
    type: "Частичная занятость",
    loc: "Удаленно",
  }
];

const CareersPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-purple-400 font-bold tracking-wider text-sm uppercase mb-2 block">Вакансии</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Карьера в КрасоМир</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Мы строим будущее креативных технологий. Ищем талантливых людей, готовых решать сложные задачи.
          </p>
        </div>

        <div className="space-y-4">
           {JOBS.map((job, idx) => (
             <div key={idx} className="bg-[#151921] border border-white/5 p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                <div>
                   <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{job.title}</h3>
                   <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.dept}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.type}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.loc}</span>
                   </div>
                </div>
                <button className="mt-4 md:mt-0 px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                   Откликнуться
                </button>
             </div>
           ))}
        </div>

        <div className="mt-20 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-8 md:p-12 text-center border border-white/10">
           <h2 className="text-2xl font-bold mb-4">Не нашли подходящую вакансию?</h2>
           <p className="text-gray-300 mb-6">Отправьте нам свое резюме, и мы свяжемся с вами, когда появится что-то интересное.</p>
           <a href="mailto:hr@photosmart.ai" className="inline-flex items-center gap-2 text-white font-bold hover:text-purple-400 transition-colors">
              hr@photosmart.ai <ArrowRight className="w-4 h-4" />
           </a>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;
