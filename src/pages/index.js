import {
  DownloadOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { Button, Col, Layout, Row } from 'antd'
import React, { useEffect, useState } from 'react'

import { CardCustom, FormField, Loader } from '../components'

const { Footer } = Layout

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <CardCustom key={post.id} {...post} />)
  }

  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
  )
}

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [allPosts, setAllPosts] = useState(null)

  const [searchText, setSearchText] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [searchedResults, setSearchedResults] = useState(null)

  const fetchPosts = async () => {
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BE_HOST}/post`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        setAllPosts(result.data)
      }
    } catch (err) {
      alert(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout)
    setSearchText(e.target.value)

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchText.toLowerCase()),
        )
        setSearchedResults(searchResult)
      }, 500),
    )
  }

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          The Community Showcase
        </h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">
          Browse through a collection of imaginative and visually stunning
          images generated by DALL-E AI
        </p>

        <a href="/create-post">
          <button
            type="button"
            className="mt-3 text-white bg-[#00804a] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            New Post
          </button>
        </a>
      </div>

      <div className="mt-16">
        <FormField
          labelName="Search posts"
          type="text"
          name="text"
          placeholder="Search something..."
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Showing Resuls for{' '}
                <span className="text-[#222328]">{searchText}</span>:
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards
                  data={searchedResults}
                  title="No Search Results Found"
                />
              ) : (
                <RenderCards data={allPosts} title="No Posts Yet" />
              )}
            </div>
          </>
        )}
      </div>
      <Row gutter={[16, 16]} style={{ marginTop: 30 }}>
        <Col span={24}>
          <Footer style={{ textAlign: 'center' }}>
            AI-Image ©2023 Created by 4Fun
          </Footer>
        </Col>
      </Row>
    </section>
  )
}

export default Home
