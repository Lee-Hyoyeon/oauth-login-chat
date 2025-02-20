import React from "react";

const Modal = ({ onClose, title }) => {
    return (
        <div
            style={{
                position: "fixed", // 화면에 고정
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center", // 가로 중앙 정렬
                alignItems: "center", // 세로 중앙 정렬
                zIndex: 1000, // 다른 요소 위에 표시
            }}
        >
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    width: "400px",
                    padding: "20px",
                    textAlign: "center",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                }}
            >
                {/* 이미지 */}
                <img
                    src="/images/err.png"
                    alt="Error"
                    style={{
                        width: "100px",
                        height: "100px",
                        marginBottom: "20px",
                    }}
                />
                <h3>{title}</h3>
                <p>Please try again.</p>

                {/* 버튼 */}
                <button
                    onClick={onClose}
                    style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "10px 20px",
                        cursor: "pointer",
                        fontSize: "16px",
                        marginTop: "20px",
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
