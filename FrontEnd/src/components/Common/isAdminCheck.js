const isAdminCheck = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return !!user && user.userId && user.userId.toLowerCase().includes("admin");
};

export default isAdminCheck;