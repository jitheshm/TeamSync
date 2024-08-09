import Navbar from '../Navbar/Navbar'

interface UserLayoutProps {
    children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
    return (
        <div className="h-[100vh] overflow-x-hidden">
            <Navbar />
            {children}
        </div>
    )
}

export default UserLayout