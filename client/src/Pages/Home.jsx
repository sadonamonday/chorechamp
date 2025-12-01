
import React from "react";
import HeroSection from "../components/home/HeroSection";
import SignupCallToAction from "../components/home/SignupCallToAction";
import TaskList from "../components/tasks/TaskList.jsx";

const Home = () => {
    return (
        <>
            <HeroSection />
            <SignupCallToAction />
            <TaskList />
        </>
    );
};

export default Home;
