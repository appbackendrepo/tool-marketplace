import Head from 'next/head';
import meta from '../../meta.json';
import { useEffect, useState } from 'react';
import { Input, Text } from '@geist-ui/core';
import { Search } from 'iconoir-react';
import PoweredBy from '@/components/poweredBy';
let stopper = true;
export default function Home() {
    const [tools, setTools] = useState([]);
    const [copyTools, setCopyTools] = useState([]);
    const [timer, setTimer] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            stopper = false;
            try {
                const res = await fetch(
                    process.env.NEXT_PUBLIC_TABLE_BACKEND_API,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const { data } = await res.json();
                setTools(data);
                setCopyTools(data);
                setTimeout(() => {
                    stopper = true;
                }, 1000);
            } catch (error) {
                console.error(error);
            }
        };
        if (stopper) fetchData();
    }, []);

    const searchResult = (e) => {
        const { value } = e.target;

        if (value === '') {
            setTools(copyTools);
            return;
        }

        clearTimeout(timer);
        const newTimer = setTimeout(async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_TABLE_BACKEND_API}/search?q=${value}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const { hits } = await res.json();
                setTools(hits);
                // handle success
            } catch (error) {
                console.error(error);
                // handle error
            }
        }, 500);

        setTimer(newTimer);
    };
    return (
        <>
            <Head>
                <title>{meta.title.value}</title>
                <meta name="description" content={meta.description.value} />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <PoweredBy />
                <div className="main-container">
                    <div className="search-input">
                        <Text h2>Tool Marketplace Template</Text>
                        <Input
                            icon={<Search />}
                            placeholder="Advance search to find tool"
                            width="100%"
                            onChange={searchResult}
                        />
                    </div>
                    <br />
                    <div className="tools">
                        {tools.map((tool, key) => (
                            <div className="card" key={key}>
                                <div className="card-image">
                                    <img src={tool.image} alt={tool.name} />
                                </div>
                                <div className="post-meta">
                                    <Text h3>{tool.price}</Text>
                                    <Text h5 my={0}>
                                        {tool.name}
                                    </Text>
                                    <Text small type="secondary" my={0}>
                                        {tool.description}
                                    </Text>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}
