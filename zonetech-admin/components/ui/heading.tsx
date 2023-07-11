"use client"
// Marcado como componente do cliente

interface HeadingProps {
    title: string;
    description: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
    return (
        <div className="flex flex-col justify-center items-center md:items-start">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
            <p className=" md:ml-0 text-sm text-muted-foreground">{description}</p>
        </div>
    )
}