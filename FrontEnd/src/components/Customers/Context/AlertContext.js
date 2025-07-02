import { createContext, useContext } from 'react';
import Swal from 'sweetalert2';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const showAlert = (options) => {
        return Swal.fire({
            confirmButtonText: '확인',
            cancelButtonText: '취소',
            ...options,   // ⭐️ 추가 옵션 다 받기! input도 들어옴
        });
    };

    // 자주 쓰는 알럿 래퍼 함수
    const alertUtils = {
        confirm: (opts) =>
            showAlert({ icon: 'warning', showCancelButton: true, ...opts }),
        success: (msg, opts = {}) =>
            showAlert({ icon: 'success', title: msg, timer: 1500, showConfirmButton: false, ...opts }),
        error: (msg, opts = {}) =>
            showAlert({ icon: 'error', title: msg, ...opts }),
        warning: (msg, opts = {}) =>
            showAlert({ icon: 'warning', title: msg, ...opts }),
    };

    return (
        <AlertContext.Provider value={{ showAlert, ...alertUtils }}>
            {children}
        </AlertContext.Provider>
    );
};

export const useAlert = () => useContext(AlertContext);
