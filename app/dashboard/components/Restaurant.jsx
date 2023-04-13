import getEvgRatting from "@/utils/avgRating";
import Link from "next/link";

export default function Restaurant({ restaurant }) {
  const { name, bookings, reviews, slug } = restaurant;
  return (
    <tr className="text-center h-12">
      <td className="text-sm text-gray-700">{name}</td>
      <td className="text-sm text-gray-700">{getEvgRatting(reviews)}</td>
      <td className="text-sm text-gray-700">{bookings.length}</td>
      <td className="text-sm text-blue-400 hover:text-blue-600">
        <Link href={`/dashboard/my-restaurants/${slug}`}>View/ Update</Link>
      </td>
    </tr>
  );
}
