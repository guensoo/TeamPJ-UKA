const isAdminCheck = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("isAdminCheck: user = ", user);
    return !!user && user.userId && user.userId.toLowerCase().includes("admin");
};

export default isAdminCheck;