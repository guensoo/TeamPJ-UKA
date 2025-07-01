// components/Common/AppLayout.jsx
import MainHeaders from '../Header/MainHeader';
import MainFooter from '../Footer/MainFooter';
import NoticeBar from '../Sidebar/NoticeBar';
import ScrollArrowButtons from '../Common/ScrollArrowButtons';

export default function AppLayout({ children }) {
    return (
        <>
            <div className="container">
                <MainHeaders />
                    {children}
                <MainFooter />
            </div>
            <NoticeBar />
            <ScrollArrowButtons />
        </>
    );
}
