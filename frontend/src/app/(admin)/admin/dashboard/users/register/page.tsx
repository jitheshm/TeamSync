import AdminAuth from "@/components/AdminPanel/Auth/AdminAuth";
import UserForm from "@/components/AdminPanel/Forms/UserForm";



function Page() {


  return (
    <AdminAuth>
      <UserForm />
    </AdminAuth>
  );
}

export default Page;
