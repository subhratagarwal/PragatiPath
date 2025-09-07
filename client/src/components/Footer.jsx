import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone, Twitter, Facebook, Instagram } from 'lucide-react'

const Footer = () => {
  return (
    <motion.footer 
      className="bg-gray-900 text-white py-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <MapPin className="h-8 w-8 text-green-400" />
              <span className="ml-2 text-2xl font-bold">CivicFix</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Empowering communities to report and resolve civic issues together. 
              Join thousands of citizens making their neighborhoods better places to live.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/report" className="text-gray-400 hover:text-white transition-colors">Report Issue</Link></li>
              <li><Link to="/issues" className="text-gray-400 hover:text-white transition-colors">Browse Issues</Link></li>
              <li><Link to="/leaderboard" className="text-gray-400 hover:text-white transition-colors">Leaderboard</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-green-400 mr-3" />
                <span className="text-gray-400">support@civicfix.org</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-green-400 mr-3" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} CivicFix. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer