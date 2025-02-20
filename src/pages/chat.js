import React, { useEffect, useState } from "react";
import { googleLogout } from "@react-oauth/google";
import { Button, Image } from "react-bootstrap";

const Chat = () => {
    const [username, setUserName] = useState(); //유저 이름
    const [messages, setMessages] = useState([]); //메시지 상태
    const [input, setInput] = useState("");
    const [ws, setWs] = useState(null); //웹소켓 상태

    useEffect(() => {
        // 웹소켓 연결
        const socket = new WebSocket("ws://localhost:3001");
        socket.onopen = () => {
            console.log("WebSocket connection opened");
        };
        // 서버로부터 메시지 받기
        socket.onmessage = (event) => {
            const message = event.data; // 서버로부터 받은 메시지
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: message, sender: "other" },
            ]);
        };
        setWs(socket);
        // 연결 종료 시 클린업
        return () => socket.close();
    }, []);

    // 쿠키에서 엑세스 토큰 받아서 유저이름 받아옴
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // 엑세스토큰 뽑아내기
                const accessToken = document.cookie.match(
                    /(?:^|;)\s*access_token=([^;]+)/
                );

                // 엑세스토큰이 없으면 바로 리턴
                if (!accessToken || !accessToken[1]) {
                    console.error("엑세스토큰이 없습니다.");
                    return;
                }
                const response = await fetch(
                    "https://www.googleapis.com/oauth2/v2/userinfo",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken[1]}`,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error("사용자 정보 요청 실패");
                }
                // 응답 데이터 받기
                const data = await response.json();
                console.log("User Name:", data.name);
                setUserName(data.name); //user name setting
            } catch (error) {
                console.error("에러 발생:", error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleLogout = () => {
        googleLogout(); // Google 세션에서 로그아웃
    };

    const sendMessage = () => {
        // 입력값에 공백만 있는 경우 메시지를 보내지 않음
        if (input.trim()) {
            // 내가 보낸 메시지 상태에 추가
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: input, sender: "me" },
                // { text: `${username}: ${input}`, sender: "me" },
            ]);
            // 서버로 메시지 전송
            ws.send(input);
            setInput(""); // 입력값 초기화
        }
    };
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center", // 세로 방향 중앙 정렬
                alignItems: "center", // 가로 방향 중앙 정렬
                margin: 0,
            }}
        >
            <h1>Chating </h1>
            <h5>{username ? `Hi, ${username}!` : "Loading..."}</h5>
            <Button
                variant="secondary"
                style={{
                    width: "80px",
                    opacity: "83%",
                    padding: "2px",
                    float: "right",
                    fontSize: "13px",
                    marginTop: "10px",
                }}
                onClick={handleLogout}
            >
                Logout
            </Button>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10%",
                }}
            >
                <div
                    style={{
                        overflowY: "auto",
                        height: "500px",
                        border: "1px solid lightgray",
                        borderRadius: "10px",
                        padding: "10px",
                    }}
                >
                    {/* 받은 메세지 내용 */}
                    {messages?.map((message, index) => (
                        <div
                            key={index}
                            style={{
                                textAlign:
                                    message.sender === "me" ? "right" : "left",
                                backgroundColor:
                                    message.sender === "me"
                                        ? "#7FACFD"
                                        : "#D1F9C7",
                                padding: "10px",
                                margin: "5px",
                                borderRadius: "10px",
                            }}
                        >
                            {message.text}
                        </div>
                    ))}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center", // 세로 방향 정렬
                            justifyContent: "center", // 가로 방향 정렬
                        }}
                    >
                        {/* 입력 텍스트 창 */}
                        <input
                            type="text"
                            style={{
                                padding: "10px",
                                margin: "5px",
                                borderRadius: "10px",
                                border: "1px solid gray",
                            }}
                            value={input}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="메시지를 입력하세요"
                        />
                        {/* 전송 버튼 */}
                        <Button onClick={sendMessage}>
                            <Image
                                src="/images/send.png"
                                alt="send"
                                style={{
                                    width: "30px",
                                    height: "30px",
                                }}
                            />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
