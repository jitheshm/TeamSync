import React from 'react'

function Footer() {
    return (
        <footer id='follow' className="flex flex-col space-y-20 justify-center m-10 bg-black text-white">
            <nav className="flex justify-center flex-wrap gap-6  font-medium">
                <a  href="#">Home</a>
                <a  href="#">Features</a>
                <a  href="#">Plans</a>
                <a  href="#">About us</a>
                
            </nav>
            <div className="flex justify-center space-x-5">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <img src="https://img.icons8.com/fluent/30/000000/facebook-new.png" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <img src="https://img.icons8.com/fluent/30/000000/linkedin-2.png" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <img src="https://img.icons8.com/fluent/30/000000/instagram-new.png" />
                </a>
                <a href="https://messenger.com" target="_blank" rel="noopener noreferrer">
                    <img src="https://img.icons8.com/fluent/30/000000/facebook-messenger--v2.png" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <img src="https://img.icons8.com/fluent/30/000000/twitter.png" />
                </a>
            </div>
            <p className="text-center text-gray-100 font-medium">© 2024 TeamSync Ltd. All rights reservered.</p>
        </footer>

    )
}

export default Footer