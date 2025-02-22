import main from '../assets/main.png'

const AuthImagePattern = ({ title, subtitle }) => {
    return (
        <div className='hidden lg:flex items-center justify-center bg-base-200 p-12 text-white'>
            <div className='max-w-md text-center relative'>
                <div className='grid grid-cols-3 gap-3 mb-8 relative'>
                    {[...Array(9)].map((_, i) => (
                        <div
                            key={i}
                            className={`aspect-square rounded-2xl bg-gradient-to-br from-blue-200 to-white ${
                                i % 2 === 0 ? "animate-pulse" : ""
                            }`}
                        />
                    ))}
                    <img 
                        src={main} 
                        alt="Main Visual" 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full shadow-lg"
                    />
                </div>

                <h2 className='text-2xl font-bold mb-4'>{title}</h2>
                <p className='text-gray-300'>{subtitle}</p>
            </div>
        </div>
    );
};

export default AuthImagePattern;
