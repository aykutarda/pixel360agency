import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, MessageCircle, CheckCircle } from 'lucide-react';
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
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
    <section id="contact" className="bg-dark py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-pixel text-white text-[32px] md:text-[48px] lg:text-[64px] leading-[1] tracking-tight mb-4">
            <span className="text-accent">B</span>İZE ULAŞIN
          </h2>
          <p className="text-gray-400 font-mono text-sm md:text-base max-w-2xl mx-auto">
            {contactData.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="font-pixel text-white text-xl mb-6">
                <span className="text-accent">H</span>IZLI İLETİŞİM
              </h3>
              
              <div className="space-y-4">
                <a 
                  href={`tel:${siteData.phone}`}
                  className="flex items-center gap-4 p-4 bg-dark-light border border-dark-lighter hover:border-accent/50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-accent/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs font-mono block">Telefon</span>
                    <span className="text-white font-mono group-hover:text-accent transition-colors">{siteData.phone}</span>
                  </div>
                </a>
                
                <a 
                  href={`https://wa.me/${siteData.whatsapp}?text=Merhaba, hizmetleriniz hakkında bilgi almak istiyorum.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/30 hover:border-green-500 transition-colors group"
                >
                  <div className="w-12 h-12 bg-green-500/20 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs font-mono block">WhatsApp</span>
                    <span className="text-white font-mono group-hover:text-green-500 transition-colors">Hemen Yazın</span>
                  </div>
                </a>
                
                <a 
                  href={`mailto:${siteData.email}`}
                  className="flex items-center gap-4 p-4 bg-dark-light border border-dark-lighter hover:border-accent/50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-accent/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs font-mono block">E-posta</span>
                    <span className="text-white font-mono group-hover:text-accent transition-colors">{siteData.email}</span>
                  </div>
                </a>
                
                <div className="flex items-center gap-4 p-4 bg-dark-light border border-dark-lighter">
                  <div className="w-12 h-12 bg-accent/10 flex items-center justify-center">
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
            <div className="bg-dark-light border border-dark-lighter p-8">
              <h3 className="font-pixel text-white text-xl mb-6">
                <span className="text-accent">Ü</span>CRETSİZ TEKLİF FORMU
              </h3>
              
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="w-16 h-16 text-accent mb-4" />
                  <h4 className="font-pixel text-white text-xl mb-2">TEŞEKKÜRLER!</h4>
                  <p className="text-gray-400 font-mono">En kısa sürede size dönüş yapacağız.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-gray-400 text-xs font-mono block mb-2">Adınız *</label>
                      <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-dark border border-dark-lighter text-white font-mono px-4 py-3 focus:border-accent focus:outline-none transition-colors"
                        placeholder="Adınız Soyadınız"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs font-mono block mb-2">Firma Adı</label>
                      <input 
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full bg-dark border border-dark-lighter text-white font-mono px-4 py-3 focus:border-accent focus:outline-none transition-colors"
                        placeholder="Firma Adınız"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-gray-400 text-xs font-mono block mb-2">Telefon *</label>
                      <input 
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full bg-dark border border-dark-lighter text-white font-mono px-4 py-3 focus:border-accent focus:outline-none transition-colors"
                        placeholder="0532 123 45 67"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs font-mono block mb-2">E-posta *</label>
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-dark border border-dark-lighter text-white font-mono px-4 py-3 focus:border-accent focus:outline-none transition-colors"
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-gray-400 text-xs font-mono block mb-2">İlgindiğiniz Hizmet *</label>
                      <select 
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        required
                        className="w-full bg-dark border border-dark-lighter text-white font-mono px-4 py-3 focus:border-accent focus:outline-none transition-colors"
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
                    <div>
                      <label className="text-gray-400 text-xs font-mono block mb-2">Bütçeniz</label>
                      <select 
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full bg-dark border border-dark-lighter text-white font-mono px-4 py-3 focus:border-accent focus:outline-none transition-colors"
                      >
                        <option value="">Seçiniz</option>
                        <option value="5000-10000">5.000₺ - 10.000₺</option>
                        <option value="10000-25000">10.000₺ - 25.000₺</option>
                        <option value="25000-50000">25.000₺ - 50.000₺</option>
                        <option value="50000+">50.000₺ +</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-gray-400 text-xs font-mono block mb-2">Mesajınız</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-dark border border-dark-lighter text-white font-mono px-4 py-3 focus:border-accent focus:outline-none transition-colors resize-none"
                      placeholder="Projeniz hakkında kısaca bilgi verin..."
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 bg-accent text-dark font-mono font-bold py-4 hover:bg-white transition-colors text-lg"
                  >
                    <Send className="w-5 h-5" />
                    ÜCRETSİZ TEKLİF GÖNDER
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
