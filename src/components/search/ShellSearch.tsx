import { FormEvent, useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { routeTo } from '../../app/routes'

export function ShellSearch() {
  const navigate = useNavigate()
  const [value, setValue] = useState('')
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const query = value.trim()
    if (query) navigate(routeTo.catalogSearch(query))
  }

  return <form className="header-search" onSubmit={submit} role="search">
    <Search size={18} aria-hidden="true" />
    <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="نام کتاب، مجموعه یا ناشر..." aria-label="جست‌وجوی کتاب" />
  </form>
}
