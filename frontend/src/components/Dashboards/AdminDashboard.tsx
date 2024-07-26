"use client";
import { ThemeState } from '@/features/theme/themeSlice';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TaskCard from '../Cards/TaskCard';
import { fetchProfit, popularPlan } from '@/api/subscriptionService/subscription';
import { logout } from '@/features/user/userSlice';
import { fetchUsersCount } from '@/api/userService/user';
import DonutChart from '../Charts/DonutChart';

interface ProfitResponse {
    data: {
        total_earned: number;
    };
}

interface UsersCountResponse {
    data: {
        usersCount: number;
    };
}

interface Plan {
    plans: {
        name: string;
    };
    count: string;
}

interface PopularPlanResponse {
    data: Plan[];
}

interface RootState {
    theme: ThemeState;
}

function AdminDashboard() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [profit, setProfit] = useState<number>(0);
    const [usersCount, setUsersCount] = useState<number>(0);
    const [planName, setPlanName] = useState<string[]>([]);
    const [planUse, setPlanUse] = useState<number[]>([]);
    const { background } = useSelector((state: RootState) => state.theme);

    useEffect(() => {
        fetchProfit()
            .then((result: ProfitResponse) => {
                setProfit(result.data.total_earned);
            })
            .catch((err) => {
                if (err.response?.status === 401) {
                    dispatch(logout());
                    router.push('/admin/login');
                }
            });

        fetchUsersCount()
            .then((result: UsersCountResponse) => {
                setUsersCount(result.data.usersCount);
            })
            .catch((err) => {
                if (err.response?.status === 401) {
                    dispatch(logout());
                    router.push('/admin/login');
                }
            });

        popularPlan()
            .then((result: PopularPlanResponse) => {
                setPlanName(result.data.map((ele) => ele.plans.name));
                setPlanUse(result.data.map((ele) => Number(ele.count)));
            })
            .catch((err) => {
                if (err.response?.status === 401) {
                    dispatch(logout());
                    router.push('/admin/login');
                }
            });
    }, []);

    return (
        <div className="w-full">
            <div
                className={`${background} min-h-64 w-11/12 md:w-6/12 mx-auto mt-10 rounded-md flex items-center justify-around flex-wrap px-20 py-10 gap-10`}
            >
                <TaskCard count={profit} title="Revenue" grd1="from-[#0A325A]" grd2="to-[#1D5BA9]" />
                <TaskCard count={usersCount} title="Users Count" grd1="from-[#0A325A]" grd2="to-[#1D5BA9]" />
            </div>
            <div>
                <div>
                    <p className='font-bold text-2xl text-center my-10'>
                        Popular Plan
                    </p>
                </div>
                <DonutChart values={planUse} labels={planName} />
            </div>
        </div>
    );
}

export default AdminDashboard;
