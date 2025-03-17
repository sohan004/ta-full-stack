import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';

const ModalPage = ({ content, setContent, width }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [element, setElement] = useState(null);

    const handleCancel = () => {
        setContent(null);
    };

    useEffect(() => {
        if (content) {
            setElement(content);
            setIsModalOpen(true);
        }
        else {
            setIsModalOpen(false);
        }
    }, [content]);

    return (
        <>
            <Modal
                className=' px-5 py-5 relative max-w-fit'
                open={isModalOpen}
                footer={null}
                closable={false}
                onCancel={handleCancel}>
                <MdOutlineClose
                    onClick={handleCancel}
                    className='bg-white text-primary text-3xl p-1 rounded-md absolute -top-4 -right-4 cursor-pointer hover:bg-primary hover:text-white duration-150' />
                {element}
            </Modal>
        </>
    );
};

export default ModalPage;