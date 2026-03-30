import { useState } from "react";
import CreatePost from "../components/CreatePost";
import { PostViewerModule } from "../components/PostsViewerModule";

export default function HomePage() {
    const [refreshKey, setRefreshKey] = useState(0);
    const refresh = () => setRefreshKey(k => k + 1);

    return (
        <main style={{ paddingTop: '56px' }}>
            <CreatePost onPostCreated={refresh} />
            <PostViewerModule key={refreshKey} onEvent={refresh} />
        </main>
    );
}