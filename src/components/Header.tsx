

export default function Header(props: React.ComponentProps<"div">) {
  return (
    <div className="p-4 bg-secondary rounded-b-lg text-xl font-semibold fixed w-full shadow-md">
      {props.children}
    </div>
  )
}