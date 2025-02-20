import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./pages/login.js";
import Chat from "./pages/chat.js";
import ModalComponent from "./components/modal.js";

function App() {
    const [showModal, setShowModal] = useState(false); // 모달 표시 여부

    useEffect(() => {
        const path = window.location.pathname;

        // /chat 경로에 접근했을 때만 모달을 띄움
        if (path === "/chat" && !document.cookie.includes("access_token")) {
            setShowModal(true);
        }
    }, []);

    const handleModalClose = () => {
        setShowModal(false);
    };

    return (
        <GoogleOAuthProvider clientId="641881315317-minurkkdos2f1l2mhapepftebuh91con.apps.googleusercontent.com">
            <BrowserRouter>
                {showModal && (
                    <ModalComponent
                        onClose={handleModalClose}
                        title="Please Log In First!"
                    />
                )}

                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route
                        path="/chat"
                        element={
                            document.cookie.includes("access_token") ? (
                                <Chat />
                            ) : (
                                // 토큰이 없으면 모달을 띄운 후 리디렉션
                                <>{showModal && <Navigate to="/" />}</>
                            )
                        }
                    />
                </Routes>
            </BrowserRouter>
        </GoogleOAuthProvider>
    );
}

export default App;
