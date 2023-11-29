import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import FileUpload from "../src/utils/FileUpload/uploadFile";

// Mock global fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
    })
);

describe('FileUpload', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('uploads a file when submitted', async () => {
        const { getByLabelText, getByText } = render(<FileUpload />);

        // Create a mock file
        const file = new File(['audio content'], './resources/test.mp3', { type: 'audio/mp3' });

        // Simulate file selection
        const input = getByLabelText(/upload/i);
        fireEvent.change(input, { target: { files: [file] } });

        // Submit the form
        fireEvent.click(getByText(/upload/i));

        // Wait for expected outcome
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

        // Additional assertions can be made here if necessary
    });
});
