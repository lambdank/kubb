export function CreatePets() {
  const href = '/pets'

  return (
    <div className="test">
      hello world
      <a href={href}>Open post</a>
      <button type="button" onClick={(e) => console.log(e)}>
        Submit
      </button>
    </div>
  )
}
