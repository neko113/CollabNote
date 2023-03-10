import { useEffect, useRef, useState } from 'react';
import noteSocket from '~/sockets/noteSocket';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';
import NoteVideoContents from '~/components/note/NoteVideoContents';
import usePeerConnection from '~/hooks/usePeerConnection';
import { SOCKET_EVENT } from '~/constants';
import useConnectedUsersStore from '~/stores/useConnectedUsersStore';

const NotePage = () => {
  const { noteId } = useParams() as { noteId: string };

  const { addConnectedUser } = useConnectedUsersStore();
  const [messages, setMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const chatListRef = useRef<HTMLDivElement>(null);

  const handleSubmitMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    noteSocket.sendMessage({ noteId, message: messageInput });
    setMessageInput('');
  };

  usePeerConnection();

  useEffect(() => {
    noteSocket.initNoteSocket();
    noteSocket.joinNote(noteId);
    noteSocket.receiveMessage({
      done: (message) => setMessages((prev) => [...prev, message]),
    });

    noteSocket.socket?.on(
      SOCKET_EVENT.EXISTING_NOTE_USERS,
      ({ users }: { users: { sid: string }[] }) => {
        users.forEach((user) => {
          addConnectedUser({ sid: user.sid });
        });
      },
    );
    return () => {
      noteSocket.leaveNote(noteId);
    };
  }, [noteId]);

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTo(0, chatListRef.current.scrollHeight);
    }
  }, [messages]);

  return (
    <Container>
      <ChatWrapper>
        <ContentsWrapper>
          <ChatContainer ref={chatListRef}>
            {messages.map((message) => {
              return <div key={crypto.randomUUID()}>{message}</div>;
            })}
          </ChatContainer>
        </ContentsWrapper>
        <ChatForm onSubmit={handleSubmitMessage}>
          <ChatInput
            placeholder="Write Message..."
            onChange={(e) => setMessageInput(e.target.value)}
            value={messageInput}
          />
          <button type="submit">Send</button>
        </ChatForm>
      </ChatWrapper>
      <NoteVideoContents noteId={noteId} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 50%;
`;

const ChatForm = styled.form`
  margin-top: 20px;
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding-right: 1rem;
`;
const ChatInput = styled.input`
  width: 100%;
  height: 40px;
  margin: 0 1rem;
  font-size: 1rem;
  border-bottom: 2px solid rgba(0, 0, 0, 0.8);
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  width: 100%;
  height: 100%;
  padding: 20px;
`;

const ContentsWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 630px;
`;

export default NotePage;
