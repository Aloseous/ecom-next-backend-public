"use client"
import CollectionsForm from "@/components/collections/CollectionsForm";
import Loader from "@/components/customUI/Loader";
import { useEffect, useState } from "react"


const CollectionDetails = ({ params }: { params: { collectionId: string } }) => {
    const [loading, setLoading] = useState(true);
    const [collectionDetails, setCollectionDetails] = useState<CollectionTypes | null>(null);

    const getCollectionDetails = async () => {
        try {
            const res = await fetch(`/api/collections/${params.collectionId}`, {
                method: "GET"
            });
            const data = await res.json();
            setCollectionDetails(data);
        } catch (error) {
            console.error("Collection Page Get -->", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCollectionDetails()
    }, [])

    return (
        <div>{loading ? <Loader /> : <CollectionsForm initialData={collectionDetails} />}</div>
    )
}

export default CollectionDetails