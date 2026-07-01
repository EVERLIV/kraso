
import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

const POSTS = [
  {
    id: 1,
    title: "Тренды AI фотографии 2025",
    excerpt: "Как генеративные модели меняют подход к созданию контента для социальных сетей и маркетплейсов.",
    date: "12 Дек 2024",
    author: "Анна С.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Как создать идеальную карточку товара",
    excerpt: "Пошаговое руководство по использованию шаблонов КрасоМир для увеличения CTR на Wildberries.",
    date: "10 Дек 2024",
    author: "Дмитрий К.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Секреты промтинга для портретов",
    excerpt: "Учимся писать правильные запросы для нейросети, чтобы сохранить черты лица и получить киношную картинку.",
    date: "05 Дек 2024",
    author: "Максим В.",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80"
  }
];

const BlogPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Блог КрасоМир</h1>
          <p className="text-gray-400">Новости, гайды и инсайты из мира AI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {POSTS.map(post => (
             <div key={post.id} className="bg-[#151921] border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all group cursor-pointer">
                <div className="h-48 overflow-hidden relative">
                   <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#151921] to-transparent opacity-60"></div>
                </div>
                <div className="p-6">
                   <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                   </div>
                   <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors">{post.title}</h3>
                   <p className="text-sm text-gray-400 mb-6 line-clamp-3">{post.excerpt}</p>
                   <button className="text-sm font-bold text-white flex items-center gap-2 group/btn">
                      Читать далее <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
