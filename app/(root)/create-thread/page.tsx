import { currentUser } from "@clerk/nextjs";
import { redirect } from 'next/navigation';
import { fetchUser } from '@/lib/actions/user.actions';
import PostThread from "@/components/forms/PostThread";

async function Page() {
    const user = await currentUser();

    if (!user) {
        console.log("User not authenticated");
        return null;
    }

    const userInfo = await fetchUser(user.id);

    if (!userInfo) {
        console.log("Error fetching user information");
        return null;
    }


    if (!userInfo.onboarded) {
        console.log("User not onboarded. Redirecting to /onboarding");
        redirect('/onboarding');
        return null; // Ensure that the function stops execution after the redirection.
    }

    console.log("User is onboarded. Allowing access.");
    return (
    <>
    <h1 className="head-text"> Create a Thread</h1>
    
    <PostThread userId={userInfo._id}/>
    </>
    )
}

export default Page;
