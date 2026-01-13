import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, MessageCircle, CheckCircle, Zap, Brain, ArrowRight, Calendar, Download } from 'lucide-react';
import { contactData, siteData, servicesData, ctaOptions } from '../data/mock';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    service: '',
    budget: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', company: '', phone: '', email: '', service: '', budget: '', message: '' });
    }, 3000);
  };

  return (
    <section id="contact" className="relative py-24 px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-light/20 via-transparent to-dark-light/30 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-accent text-sm font-mono tracking-wider">HAREKETE GEÇİN</span>
          </div>
          <h2 className="font-pixel text-white text-[32px] md:text-[48px] lg:text-[64px] leading-[1] tracking-tight mb-4">
            <span className="text-accent">B</span>ÜYÜMEYE HAZIR MISINIZ?
          </h2>
          <p className="text-gray-400 font-mono text-sm md:text-base max-w-2xl mx-auto">
            {contactData.description}
          </p>
        </div>

        {/* CTA Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {ctaOptions.map((cta, index) => (
            <button 
              key={index}
              className={`group p-6 border transition-all duration-300 text-left ${
                index === 0 
                  ? 'bg-accent text-dark border-accent hover:bg-white' 
                  : 'bg-dark-light/50 border-dark-lighter text-white hover:border-accent'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {index === 0 && <Calendar className="w-5 h-5" />}
                {index === 1 && <Brain className="w-5 h-5 text-accent group-hover:text-accent" />}
                {index === 2 && <Download className="w-5 h-5 text-accent group-hover:text-accent" />}
                <span className="font-mono font-bold">{cta.text}</span>
              </div>
              <p className={`text-sm font-mono ${index === 0 ? 'text-dark/70' : 'text-gray-400'}`}>
                {cta.description}
              </p>
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-pixel text-white text-xl mb-6 flex items-center gap-3">
              <Zap className="w-5 h-5 text-accent animate-pulse" />
              <span><span className="text-accent">H</span>IZLI İLETİŞİM</span>
            </h3>
            
            <div className="space-y-4">
              <a 
                href={`tel:${siteData.phone}`}
                className="group flex items-center gap-4 p-4 bg-dark-light/50 backdrop-blur-sm border border-dark-lighter hover:border-accent/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:bg-accent transition-colors">
                  <Phone className="w-5 h-5 text-accent group-hover:text-dark transition-colors" />
                </div>
                <div>
                  <span className="text-gray-400 text-xs font-mono block">Hemen Ara</span>
                  <span className="text-white font-mono group-hover:text-accent transition-colors">{siteData.phone}</span>
                </div>
              </a>
              
              <a 
                href={`https://wa.me/${siteData.whatsapp}?text=Merhaba, büyüme stratejisi hakkında görüşmek istiyorum.`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/30 hover:border-green-500 hover:bg-green-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-green-500/20 flex items-center justify-center group-hover:bg-green-500 transition-colors">
                  <MessageCircle className="w-5 h-5 text-green-500 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <span className="text-gray-400 text-xs font-mono block">WhatsApp</span>
                  <span className="text-white font-mono group-hover:text-green-500 transition-colors">Anlık Yanıt Alın</span>
                </div>
              </a>
              
              <a 
                href={`mailto:${siteData.email}`}
                className="group flex items-center gap-4 p-4 bg-dark-light/50 backdrop-blur-sm border border-dark-lighter hover:border-accent/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:bg-accent transition-colors">
                  <Mail className="w-5 h-5 text-accent group-hover:text-dark transition-colors" />
                </div>
                <div>
                  <span className="text-gray-400 text-xs font-mono block">E-posta</span>
                  <span className="text-white font-mono group-hover:text-accent transition-colors">{siteData.email}</span>
                </div>
              </a>
              
              <div className="flex items-center gap-4 p-4 bg-dark-light/50 backdrop-blur-sm border border-dark-lighter">
                <div className="w-12 h-12 bg-accent/10 flex items-center justify-center border border-accent/20">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <span className="text-gray-400 text-xs font-mono block">Ofis</span>
                  <span className="text-white font-mono">{siteData.address}</span>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="flex items-center gap-3 p-4 bg-accent/5 border border-accent/20">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-400 font-mono text-sm">
                Ortalama yanıt süresi: <span className="text-accent font-bold">2 saat</span>
              </span>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="relative bg-dark-light/50 backdrop-blur-sm border border-dark-lighter p-8">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-accent"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-accent"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent"></div>
              
              <h3 className="font-pixel text-white text-xl mb-6 flex items-center gap-3">
                <Brain className="w-5 h-5 text-accent" />
                <span>{contactData.formTitle}</span>
              </h3>
              
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-accent flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-dark" />
                  </div>
                  <h4 className="font-pixel text-accent text-xl mb-2">MÜKEMMEL!</h4>
                  <p className="text-gray-400 font-mono">Uzman ekibimiz 24 saat içinde sizinle iletişime geçecek.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-gray-400 text-xs font-mono block mb-2">Adınız *</label>
                      <input 
                        type="text" name="name" value={formData.name} onChange={handleChange}
                        onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                        required
                        className={`w-full bg-dark/50 border text-white font-mono px-4 py-3 focus:outline-none transition-all ${focusedField === 'name' ? 'border-accent shadow-[0_0_15px_rgba(230,255,0,0.2)]' : 'border-dark-lighter'}`}
                        placeholder="Adınız Soyadınız"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs font-mono block mb-2">Firma / Marka *</label>
                      <input 
                        type="text" name="company" value={formData.company} onChange={handleChange}
                        onFocus={() => setFocusedField('company')} onBlur={() => setFocusedField(null)}
                        required
                        className={`w-full bg-dark/50 border text-white font-mono px-4 py-3 focus:outline-none transition-all ${focusedField === 'company' ? 'border-accent shadow-[0_0_15px_rgba(230,255,0,0.2)]' : 'border-dark-lighter'}`}
                        placeholder="Firma veya Marka Adı"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-gray-400 text-xs font-mono block mb-2">Telefon *</label>
                      <input 
                        type="tel" name="phone" value={formData.phone} onChange={handleChange}
                        onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)}
                        required
                        className={`w-full bg-dark/50 border text-white font-mono px-4 py-3 focus:outline-none transition-all ${focusedField === 'phone' ? 'border-accent shadow-[0_0_15px_rgba(230,255,0,0.2)]' : 'border-dark-lighter'}`}
                        placeholder="0532 123 45 67"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs font-mono block mb-2">E-posta *</label>
                      <input 
                        type="email" name="email" value={formData.email} onChange={handleChange}
                        onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                        required
                        className={`w-full bg-dark/50 border text-white font-mono px-4 py-3 focus:outline-none transition-all ${focusedField === 'email' ? 'border-accent shadow-[0_0_15px_rgba(230,255,0,0.2)]' : 'border-dark-lighter'}`}
                        placeholder="ornek@firma.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-gray-400 text-xs font-mono block mb-2">İlgindiğiniz Alan *</label>
                      <select 
                        name="service" value={formData.service} onChange={handleChange}
                        onFocus={() => setFocusedField('service')} onBlur={() => setFocusedField(null)}
                        required
                        className={`w-full bg-dark/50 border text-white font-mono px-4 py-3 focus:outline-none transition-all ${focusedField === 'service' ? 'border-accent shadow-[0_0_15px_rgba(230,255,0,0.2)]' : 'border-dark-lighter'}`}
                      >
                        <option value="">Seçiniz</option>
                        {servicesData.services.map((service) => (
                          <option key={service.id} value={service.shortName}>{service.shortName}</option>
                        ))}
                        <option value="360 Paket">360° Tam Büyüme Paketi</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs font-mono block mb-2">Aylık Bütçe</label>
                      <select 
                        name="budget" value={formData.budget} onChange={handleChange}
                        onFocus={() => setFocusedField('budget')} onBlur={() => setFocusedField(null)}
                        className={`w-full bg-dark/50 border text-white font-mono px-4 py-3 focus:outline-none transition-all ${focusedField === 'budget' ? 'border-accent shadow-[0_0_15px_rgba(230,255,0,0.2)]' : 'border-dark-lighter'}`}
                      >
                        <option value="">Seçiniz</option>
                        <option value="25000-50000">25.000₺ - 50.000₺</option>
                        <option value="50000-100000">50.000₺ - 100.000₺</option>
                        <option value="100000-250000">100.000₺ - 250.000₺</option>
                        <option value="250000+">250.000₺ +</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-gray-400 text-xs font-mono block mb-2">Büyüme Hedefiniz</label>
                    <textarea 
                      name="message" value={formData.message} onChange={handleChange}
                      onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)}
                      rows={3}
                      className={`w-full bg-dark/50 border text-white font-mono px-4 py-3 focus:outline-none transition-all resize-none ${focusedField === 'message' ? 'border-accent shadow-[0_0_15px_rgba(230,255,0,0.2)]' : 'border-dark-lighter'}`}
                      placeholder="Nasıl bir büyüme hedefliyorsunuz? Hangi sorunları çözmek istiyorsunuz?"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="group relative w-full flex items-center justify-center gap-3 bg-accent text-dark font-mono font-bold py-4 hover:bg-white transition-all text-lg overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <Send className="w-5 h-5" />
                      STRATEJİ GÖRÜŞMESİ TALEP ET
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
