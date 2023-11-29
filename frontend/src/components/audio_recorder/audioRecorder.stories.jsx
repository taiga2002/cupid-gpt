import React from 'react';
import AudioRecorder from './AudioRecorder'; // Adjust the import path as necessary

// Default export that describes the component
export default {
    title: 'AudioRecorder',
    component: AudioRecorder,
};

// Template for your component
const Template = (args) => <AudioRecorder {...args} />;

// Default view of your component
export const Default = Template.bind({});
