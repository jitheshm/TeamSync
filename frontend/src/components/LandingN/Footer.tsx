import React from 'react'

function Footer() {
    return (
        <footer className=" py-10">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between">
                    {/* Company Info */}
                    <div className="mb-8 md:mb-0">
                        <h3 className="text-2xl font-bold text-white">TeamSync</h3>
                        <p className="mt-2 text-gray-200 md:w-6/12">Empowering your business with smart solutions. Join us today to make your work smarter and easier.</p>
                    </div>
                    {/* Links Section */}
                    <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 w-8/12">
                        <div>
                            <h4 className="font-medium text-white mb-2">Company</h4>
                            <ul>
                                <li><a href="#" className="text-gray-200 font-light hover:text-white">About Us</a></li>
                                <li><a href="#" className="text-gray-200 font-light hover:text-white">Careers</a></li>
                                <li><a href="#" className="text-gray-200 font-light hover:text-white">Blog</a></li>
                                <li><a href="#" className="text-gray-200 font-light hover:text-white">Press</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-white mb-2">Product</h4>
                            <ul>
                                <li><a href="#" className="text-gray-200 font-light hover:text-white">Features</a></li>
                                <li><a href="#" className="text-gray-200 font-light hover:text-white">Pricing</a></li>
                                <li><a href="#" className="text-gray-200 font-light hover:text-white">Integrations</a></li>
                                <li><a href="#" className="text-gray-200 font-light hover:text-white">API</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-white mb-2">Support</h4>
                            <ul>
                                <li><a href="#" className="text-gray-200 font-light hover:text-white">Help Center</a></li>
                                <li><a href="#" className="text-gray-200 font-light hover:text-white">FAQs</a></li>
                                <li><a href="#" className="text-gray-200 font-light hover:text-white">Contact Us</a></li>
                                <li><a href="#" className="text-gray-200 font-light hover:text-white">Live Chat</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-white mb-2">Legal</h4>
                            <ul>
                                <li><a href="#" className="text-gray-200 font-light hover:text-white">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-200 font-light hover:text-white">Terms of Service</a></li>
                                <li><a href="#" className="text-gray-200 font-light hover:text-white">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Social Media & Copyright */}
                <div className="mt-8 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-gray-200">© 2024 TeamSync. All rights reserved.</p>
                    </div>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-200 hover:text-white"><i className="fab fa-facebook-f" /></a>
                        <a href="#" className="text-gray-200 hover:text-white"><i className="fab fa-twitter" /></a>
                        <a href="#" className="text-gray-200 hover:text-white"><i className="fab fa-linkedin-in" /></a>
                        <a href="#" className="text-gray-200 hover:text-white"><i className="fab fa-instagram" /></a>
                    </div>
                </div>
            </div>
        </footer>
    )


}

export default Footer