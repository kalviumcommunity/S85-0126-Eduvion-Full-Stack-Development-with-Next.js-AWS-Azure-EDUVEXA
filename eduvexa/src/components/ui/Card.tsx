interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gradient" | "bordered";
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
}

export default function Card({ 
  title, 
  children, 
  className = "", 
  variant = "default",
  footer,
  headerAction
}: CardProps) {
  const variantStyles = {
    default: "bg-white border border-gray-200",
    gradient: "bg-gradient-to-br from-white to-purple-50/50 border border-purple-100",
    bordered: "bg-white border-2 border-indigo-200"
  };

  return (
    <div className={`rounded-xl shadow-md overflow-hidden ${variantStyles[variant]} ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
}
