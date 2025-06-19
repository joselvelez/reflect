import MessageDetail from '../../../components/MessageDetail'

export default function MessageDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <MessageDetail messageId={params.id} />
    </div>
  )
}
