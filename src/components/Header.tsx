

export default function Header(props: React.ComponentProps<"div">) {
  return (
    <div className="p-4 bg-secondary rounded-b-lg text-xl font-semibold fixed top-0 w-full border-b-1 shadow-md z-50">
      {props.children}
    </div>
  )
}