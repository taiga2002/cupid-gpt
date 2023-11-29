'use client';
import Card from '@/components/card/Card';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Link,
  ListItem,
  UnorderedList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { MdLock } from 'react-icons/md';
import AudioRecorder   from "@/components/audio_recorder/AudioRecorder";

function APIModal(props:
                      { setApiKey: any, setInputBoxValue: any }
) {
  return (
    <>
      <AudioRecorder setInputBoxValue={ props.setInputBoxValue }/>
    </>
  );
}

export default APIModal;
