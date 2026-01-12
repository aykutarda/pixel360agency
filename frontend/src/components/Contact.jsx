import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, MessageCircle, CheckCircle, Zap } from 'lucide-react';
import { contactData, siteData, servicesData } from '../data/mock';

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
      setFormData({
        name: '',
        company: '',
        phone: '',
        email: '',
        service: '',
        budget: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <section id="contact" className="relative py-24 px-6 md:px-12 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-light/20 via-transparent to-dark-light/30 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-pixel text-white text-[32px] md:text-[48px] lg:text-[64px] leading-[1] tracking-tight mb-4 pixel-text">
            <span className="text-accent glitch" data-text="B">B</span>İZE ULAŞIN
          </h2>
          <p className="text-gray-400 font-mono text-sm md:text-base max-w-2xl mx-auto">
            {contactData.description}
          </p>
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-accent"></div>
            <div className="w-2 h-2 bg-accent rotate-45 animate-pulse"></div>
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-accent"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <h3 className="font-pixel text-white text-xl mb-6 flex items-center gap-3">
                <Zap className="w-5 h-5 text-accent animate-pulse" />
                <span><span className="text-accent">H</span>IZLI İLETİŞİM</span>
              </h3>
              
              <div className="space-y-4">
                <a 
                  href={`tel:${siteData.phone}`}
                  className="group flex items-center gap-4 p-4 bg-dark-light/50 backdrop-blur-sm border border-dark-lighter hover:border-accent/50 transition-all duration-300 hover-glow"
                >
                  <div className="w-12 h-12 bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:bg-accent/20 transition-colors">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs font-mono block">Telefon</span>
                    <span className="text-white font-mono group-hover:text-accent transition-colors">{siteData.phone}</span>
                  </div>
                  {/* Corner accents */}
                  <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-accent/30 group-hover:border-accent transition-colors"></div>
                </a>
                
                <a 
                  href={`https://wa.me/${siteData.whatsapp}?text=Merhaba, hizmetleriniz hakkında bilgi almak istiyorum.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/30 hover:border-green-500 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="w-12 h-12 bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <MessageCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs font-mono block">WhatsApp</span>
                    <span className="text-white font-mono group-hover:text-green-500 transition-colors">Hemen Yazın</span>
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </a>
                
                <a 
                  href={`mailto:${siteData.email}`}
                  className="group flex items-center gap-4 p-4 bg-dark-light/50 backdrop-blur-sm border border-dark-lighter hover:border-accent/50 transition-all duration-300 hover-glow"
                >
                  <div className="w-12 h-12 bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:bg-accent/20 transition-colors">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs font-mono block">E-posta</span>
                    <span className="text-white font-mono group-hover:text-accent transition-colors">{siteData.email}</span>
                  </div>
                </a>
                
                <div className="group flex items-center gap-4 p-4 bg-dark-light/50 backdrop-blur-sm border border-dark-lighter">
                  <div className="w-12 h-12 bg-accent/10 flex items-center justify-center border border-accent/20">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs font-mono block">Adres</span>
                    <span className="text-white font-mono">{siteData.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="relative bg-dark-light/50 backdrop-blur-sm border border-dark-lighter p-8 hover-glow">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent/50"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-accent/50"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-accent/50"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent/50"></div>
              
              <h3 className="font-pixel text-white text-xl mb-6">
                <span className="text-accent">Ü</span>CRETSİZ TEKLİF FORMU
              </h3>
              
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-accent/20 flex items-center justify-center mb-6 glitch-box">
                    <CheckCircle className="w-10 h-10 text-accent" />
                  </div>
                  <h4 className="font-pixel text-white text-xl mb-2 glitch">TEŞEKKÜRLER!</h4>
                  <p className="text-gray-400 font-mono">En kısa sürede size dönüş yapacağız.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="text-gray-400 text-xs font-mono block mb-2">Adınız *</label>
                      <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`w-full bg-dark/50 border text-white font-mono px-4 py-3 focus:outline-none transition-all duration-300 ${focusedField === 'name' ? 'border-accent shadow-[0_0_10px_rgba(230,255,0,0.3)]' : 'border-dark-lighter'}`}
                        placeholder="Adınız Soyadınız"
                      />
                    </div>
                    <div className="relative">
                      <label className="text-gray-400 text-xs font-mono block mb-2">Firma Adı</label>
                      <input 
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('company')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full bg-dark/50 border text-white font-mono px-4 py-3 focus:outline-none transition-all duration-300 ${focusedField === 'company' ? 'border-accent shadow-[0_0_10px_rgba(230,255,0,0.3)]' : 'border-dark-lighter'}`}
                        placeholder="Firma Adınız"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="text-gray-400 text-xs font-mono block mb-2">Telefon *</label>
                      <input 
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`w-full bg-dark/50 border text-white font-mono px-4 py-3 focus:outline-none transition-all duration-300 ${focusedField === 'phone' ? 'border-accent shadow-[0_0_10px_rgba(230,255,0,0.3)]' : 'border-dark-lighter'}`}
                        placeholder="0532 123 45 67"
                      />
                    </div>
                    <div className="relative">
                      <label className="text-gray-400 text-xs font-mono block mb-2">E-posta *</label>
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`w-full bg-dark/50 border text-white font-mono px-4 py-3 focus:outline-none transition-all duration-300 ${focusedField === 'email' ? 'border-accent shadow-[0_0_10px_rgba(230,255,0,0.3)]' : 'border-dark-lighter'}`}
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="text-gray-400 text-xs font-mono block mb-2">İlgindiğiniz Hizmet *</label>
                      <select 
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('service')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`w-full bg-dark/50 border text-white font-mono px-4 py-3 focus:outline-none transition-all duration-300 ${focusedField === 'service' ? 'border-accent shadow-[0_0_10px_rgba(230,255,0,0.3)]' : 'border-dark-lighter'}`}
                      >
                        <option value="">Seçiniz</option>
                        {servicesData.services.map((service) => (
                          <option key={service.id} value={service.shortName}>
                            {service.shortName}
                          </option>
                        ))}
                        <option value="360 Paket">360° Tam Paket</option>
                      </select>
                    </div>
                    <div className="relative">
                      <label className="text-gray-400 text-xs font-mono block mb-2">Bütçeniz</label>
                      <select 
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('budget')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full bg-dark/50 border text-white font-mono px-4 py-3 focus:outline-none transition-all duration-300 ${focusedField === 'budget' ? 'border-accent shadow-[0_0_10px_rgba(230,255,0,0.3)]' : 'border-dark-lighter'}`}
                      >
                        <option value="">Seçiniz</option>
                        <option value="5000-10000">5.000₺ - 10.000₺</option>
                        <option value="10000-25000">10.000₺ - 25.000₺</option>
                        <option value="25000-50000">25.000₺ - 50.000₺</option>
                        <option value="50000+">50.000₺ +</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label className="text-gray-400 text-xs font-mono block mb-2">Mesajınız</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      rows={4}
                      className={`w-full bg-dark/50 border text-white font-mono px-4 py-3 focus:outline-none transition-all duration-300 resize-none ${focusedField === 'message' ? 'border-accent shadow-[0_0_10px_rgba(230,255,0,0.3)]' : 'border-dark-lighter'}`}
                      placeholder="Projeniz hakkında kısaca bilgi verin..."
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="group relative w-full flex items-center justify-center gap-3 bg-accent text-dark font-mono font-bold py-4 hover:bg-white transition-all text-lg overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <Send className="w-5 h-5" />
                      ÜCRETSİZ TEKLİF GÖNDER
                    </span>
                    <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  </button>
                  
                  <p className="text-gray-500 text-xs font-mono text-center">
                    * Bilgileriniz gizli tutulacaktır. 24 saat içinde dönüş sağlanacaktır.
                  </p>
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
