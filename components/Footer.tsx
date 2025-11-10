import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Corporate Solutions', href: '/corporate' },
    { name: 'Visa Services', href: '/visas' },
    { name: 'Tour Packages', href: '/tours' },
    { name: 'Track Application', href: '/track' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const popularVisas = [
    { name: 'Dubai Visa', href: '/visas/dubai' },
    { name: 'Schengen Visa', href: '/visas/schengen' },
    { name: 'UK Visa', href: '/visas/uk' },
    { name: 'USA Visa', href: '/visas/usa' },
    { name: 'Singapore Visa', href: '/visas/singapore' },
    { name: 'Thailand Visa', href: '/visas/thailand' },
  ];

  const legal = [
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Refund Policy', href: '/refund-policy' },
    { name: 'Cookie Policy', href: '/cookie-policy' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">Travunited</h3>
            <p className="text-sm mb-4">
              Travunited of India Pvt Ltd<br />
              Making global travel and visa services simple, fast, and transparent.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/travunited" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/travunited" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/travunited" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/travunited" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Visas */}
          <div>
            <h4 className="text-white font-semibold mb-4">Popular Visas</h4>
            <ul className="space-y-2">
              {popularVisas.map((visa) => (
                <li key={visa.name}>
                  <Link
                    href={visa.href}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {visa.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start text-sm">
                <MapPin className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>
                  #F307, 1st Floor, Regal Nxt,<br />
                  Udupi, Karnataka – 576103,<br />
                  India
                </span>
              </li>
              <li className="flex items-center text-sm">
                <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
                <a href="tel:+916360392398" className="hover:text-primary-400">
                  +91 6360392398
                </a>
              </li>
              <li className="flex items-center text-sm">
                <MessageCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <a href="https://wa.me/916360392398" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400">
                  WhatsApp Chat
                </a>
              </li>
              <li className="flex items-center text-sm">
                <Mail className="w-5 h-5 mr-2 flex-shrink-0" />
                <a href="mailto:info@travunited.com" className="hover:text-primary-400">
                  info@travunited.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Travunited of India Pvt Ltd. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
