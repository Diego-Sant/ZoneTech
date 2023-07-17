"use client";
// Marcado como componente do cliente

import { useEffect, useState } from "react";

import { Button } from "./button";

import { ImagePlus, Trash } from "lucide-react";

import Image from "next/image";

import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({ disabled, onChange, onRemove, value }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    const onUpload = (result: any) => {
        onChange(result.info.secure_url); // Foi pego isso usando console.log de quando a imagem era upada
    }

    if (!isMounted) {
        return null; // quando o setIsMounted terminar, irá enviar para o componente de servidor
    }
    
    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url, index) => (
                    <div key={index} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                        <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                            <Trash className="w-4 h-4" />
                        </Button>
                        </div>
                        <Image fill className="object-cover" alt="Painel publicitário" src={url} />
                    </div>
                ))}
            </div>
            <CldUploadWidget onUpload={onUpload} uploadPreset="smnrph9e">
                    {({ open }) => {
                        const onClick= () => {
                            open();
                        }

                        return (
                            <Button type="button" disabled={disabled} variant="secondary" onClick={onClick}>
                                <ImagePlus className="w-4 h-4 mr-2" />
                                Escolha uma imagem
                            </Button>
                        )
                    }}
            </CldUploadWidget>
        </div>
    )
}

export default ImageUpload;