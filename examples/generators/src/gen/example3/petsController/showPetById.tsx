export function ShowPetById() {
  const href = '/pets/:petId'

  return (
    <div className="test">
      hello world
      <a href={href}>Open get</a>
      <button type="button" onClick={(e) => console.log(e)}>
        Submit
      </button>
    </div>
  )
}
