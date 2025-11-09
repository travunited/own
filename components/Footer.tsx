import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

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
              Your trusted partner for visa applications and curated tour packages.
              Making travel simple, secure, and seamless.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
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
                <span>123 Business Park, Bangalore, Karnataka 560001, India</span>
              </li>
              <li className="flex items-center text-sm">
                <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
                <a href="tel:+911234567890" className="hover:text-primary-400">
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-center text-sm">
                <Mail className="w-5 h-5 mr-2 flex-shrink-0" />
                <a href="mailto:support@travunited.com" className="hover:text-primary-400">
                  support@travunited.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Travunited. All rights reserved.
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

