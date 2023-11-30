'use client';
/*eslint-disable*/

import MessageBoxChat from '@/components/MessageBox';
import {Button, Flex, Icon, Img, Input, Text, useColorModeValue,} from '@chakra-ui/react';
import {useEffect, useRef, useState} from 'react';
import {MdAutoAwesome, MdPerson} from 'react-icons/md';
import Bg from '../public/img/chat/bg-image.png';
import axios from 'axios';
import APIModal from "@/components/apiModal";
// @ts-ignore
import { uploadAudio, processText, audioToText, generateSpeechMP3 } from "@/utils/functions";
import Mp3Reader from "@/components/mpe3_reader/Mp3Reader";

type ChatMessage = {
    type: 'sent' | 'received';
    message: string;
};

type ChatHistory = ChatMessage[];


export default function Chat() {
    // Input States
    const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
    const [inputCode, setInputCode] = useState<string>('');
    const [inputBoxValue, setInputBoxValue] = useState<string>('');
    // Response message
    const [outputCode, setOutputCode] = useState<string>('');
    // Loading state
    const [loading, setLoading] = useState<boolean>(false);

    const [apiDocURL, setURL] = useState('');

    const [chatHistory, setChatHistory] = useState<ChatHistory>([]);

    const messagesEndRef = useRef(null);

    const [musicSrc, setMusicSrc] = useState("");

    const scrollToBottom = () => {
        // @ts-ignore
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    useEffect(() => {
        setInputCode(inputBoxValue)
    }, [inputBoxValue]);

    useEffect(() => {
        if (chatHistory.length === 0) {
            return;
        }
        scrollToBottom();
        if (chatHistory[chatHistory.length - 1].type === 'sent') {
            userMsgToServerMsg(chatHistoryToConversation(chatHistory)).catch(
                (error) => {
                    console.log(error);
                },
            )
        } else if (chatHistory[chatHistory.length - 1].type === 'received') {
            console.log("Received message");
            let receivedMsg = chatHistory[chatHistory.length - 1].message;
            console.log(receivedMsg);
            // @ts-ignore
            generateSpeechMP3(receivedMsg).then((response) => {
                console.log("MP33333333333333333 Response Received");
                console.log(response);
                setMusicSrc(response);
            //   @ts-ignore
            }).catch((error) => {
                console.log(error);
            });
        }
    }, [chatHistory]);


    async function userMsgToServerMsg(conversation: string[]) {
        try {
            if (conversation.length === 0) {
                return;
            }
            console.log(`Final sent convesation ${conversation}`);
            setLoading(true);
            console.log("Query Sent");
            processText(conversation[0]).then((response) => {
                console.log("Response Received");
                chatHistory.forEach((chat, index) => console.log(index, chat.message));
                let data = response.reply;
                console.log(data);
                setLoading(false);
                // set new chat to history
                console.log("key point")
                const newReply: ChatMessage = {type: 'received', message: data};
                const newHist = [...chatHistory, newReply].filter(chat => chat.message.trim() !== "");
                newHist.forEach((chat, index) => console.log(index, chat.message));
                console.log(`Test chat history: ${newHist}`);
                setChatHistory(newHist);
            }).catch((error) => {
                console.log(error);
            });
        } catch (error) {
            console.error('Error fetching data: ', error);
            alert('Something went wrong when fetching from the API. Please check the console for more details.');
        }
    }

    function chatHistoryToConversation(chatHistory: ChatHistory): string[] {
        let conversation: string[] = [];
        for (let i = 0; i < chatHistory.length; i++) {
            conversation.push(chatHistory[i].message);
        }
        console.log(`Conversation transformed: ${conversation}`);
        return conversation;
    }

    const handleTranslate = async () => {
        
        setInputOnSubmit(inputCode);

        if (!inputCode) {
            alert('Please enter your message.');
            return;
        }

        const newChat: ChatMessage = {type: 'sent', message: inputCode};
        console.log(`Test new inserted question: ${newChat.message}`);
        let newHist = [...chatHistory, newChat].filter(chat => chat.message.trim() !== "");
        console.log(`Test chat history: ${newHist}`);
        newHist.forEach((chat, index) => console.log(index, chat.message));
        setChatHistory(newHist);
        console.log("test actual variable here")
        chatHistory.forEach((chat, index) => console.log("1293123123", index, chat.message));
        console.log("wtf")

        setOutputCode(' ');
        setLoading(true);
        setLoading(false);
    };

    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
    const inputColor = useColorModeValue('navy.700', 'white');
    const brandColor = useColorModeValue('brand.500', 'white');
    const textColor = useColorModeValue('navy.700', 'white');
    const placeholderColor = useColorModeValue(
        {color: 'gray.500'},
        {color: 'whiteAlpha.600'},
    );

    const handleChange = (Event: any) => {
        setInputCode(Event.target.value);
    };

    return (
        <Flex
            w="100%"
            pt={{base: '70px', md: '0px'}}
            direction="column"
            position="relative"
        >
            <Img
                src={Bg.src}
                position={'absolute'}
                w="350px"
                left="50%"
                top="50%"
                transform={'translate(-50%, -50%)'}
            />
            <Flex
                direction="column"
                mx="auto"
                w={{base: '100%', md: '100%', xl: '100%'}}
                minH={{base: '75vh', '2xl': '85vh'}}
                maxW="1000px"
            >
                {/* Model Change */}
                <Flex direction={'column'} w="100%" mb={outputCode ? '20px' : 'auto'}>
                </Flex>
                {/* Main Box */}
                <Flex direction="column" w="100%" mx="auto" mb={'auto'}>
                    {chatHistory.filter(chat => chat.message.trim() !== "").map((chat, index) => (
                        <Flex key={index} w="100%" align={'center'} mb="10px">
                            <Flex
                                borderRadius="full"
                                justify="center"
                                align="center"
                                bg={chat.type === 'sent' ? 'transparent' : 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'}
                                me="20px"
                                h="40px"
                                minH="40px"
                                minW="40px"
                            >
                                <Icon
                                    as={chat.type === 'sent' ? MdPerson : MdAutoAwesome}
                                    width="20px"
                                    height="20px"
                                    color={chat.type === 'sent' ? brandColor : 'white'}
                                />
                            </Flex>
                            <Flex
                                p="22px"
                                border="1px solid"
                                borderColor={borderColor}
                                borderRadius="14px"
                                w="100%"
                                zIndex={'2'}
                            >
                                {chat.type === 'sent' ? (
                                    <Text
                                        color={textColor}
                                        fontWeight="600"
                                        fontSize={{base: 'sm', md: 'md'}}
                                        lineHeight={{base: '24px', md: '26px'}}
                                    >
                                        {chat.message}
                                    </Text>
                                ) : (
                                    <MessageBoxChat output={chat.message}/>
                                )}
                            </Flex>
                        </Flex>
                    ))}
                    <div ref={messagesEndRef}/>
                </Flex>


                {/* Chat Input */}
                <Flex
                    ms={{base: '0px', xl: '60px'}}
                    mt="20px"
                    justifySelf={'flex-end'}
                >
                    <Input
                        minH="54px"
                        h="100%"
                        border="1px solid"
                        borderColor={borderColor}
                        borderRadius="45px"
                        p="15px 20px"
                        me="10px"
                        fontSize="sm"
                        fontWeight="500"
                        _focus={{borderColor: 'none'}}
                        color={inputColor}
                        _placeholder={placeholderColor}
                        placeholder="Type your message here..."
                        value={inputBoxValue}
                        onChange={handleChange}
                    />
                    <Button
                        variant="primary"
                        py="20px"
                        px="16px"
                        fontSize="sm"
                        borderRadius="45px"
                        ms="auto"
                        w={{base: '160px', md: '210px'}}
                        h="54px"
                        _hover={{
                            boxShadow:
                                '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
                            bg:
                                'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
                            _disabled: {
                                bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
                            },
                        }}
                        onClick={() => handleTranslate()}
                        isLoading={loading ? true : false}
                    >
                        Submit
                    </Button>
                    <div style={{paddingLeft:'10px'}}></div>
                    <APIModal 
                    setApiKey={setURL}
                    setInputBoxValue={setInputBoxValue}/>
                    <Mp3Reader musicSrc={musicSrc}/>

                </Flex>

                <Flex
                    justify="center"
                    mt="20px"
                    direction={{base: 'column', md: 'row'}}
                    alignItems="center"
                >
                </Flex>
            </Flex>
        </Flex>
    );

}
