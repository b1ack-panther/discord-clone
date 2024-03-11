const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="grid place-content-center h-full">
    {children}
  </div>;
};

export default AuthLayout;
