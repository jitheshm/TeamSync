import Navbar from '../Navbar/Navbar'

interface UserLayoutProps {
    children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
    return (
        <div >
            <Navbar />
            {children}
        </div>
    )
}

export default UserLayout