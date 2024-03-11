import { currentUser } from "@clerk/nextjs";
import { redirect } from 'next/navigation';
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import PostThread from "@/components/forms/PostThread";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import UserCard from "@/components/cards/UserCard";


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

    const result = await fetchUsers({
        userId: user.id,
        searchString:'',
        pageNumber: 1,
        pageSize: 25,
    })

    return(
        <section>
            <h1 className="head-text mb-10">Search</h1>
        
            {/*Seach Bar*/}

            <div className="mt-14 flex flex-col gap-9">
                {result.users.length === 0?(
                    <p className="no-result">No users</p>
                ): 
                <>
                {result.users.map((person)=>(
                    <UserCard 
                        key={person.id}
                        id={person.id}
                        name={person.name}
                        username={person.username}
                        imgUrl={person.image}
                        personType='User'
                    />
                ))}
                </>
                }
            </div>
        </section>
    )
}

export default Page;