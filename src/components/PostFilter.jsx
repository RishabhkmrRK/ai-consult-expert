import { ListFilter, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { addDays, format } from "date-fns"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';

export default function PostFilter({ posts }) {
  const [showFilters, setShowFilters] = useState(false);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [dateFilter, setDateFilter] = useState('latest');
  const [dateRange, setCustomRange] = useState({
    from: new Date(2025,3, 20),
    to: addDays(new Date(2025, 3, 20), 20),
  });
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredPosts = posts
  .filter((post) => {
    const matchesCategory = category && category !== "all" ? post.category === category : true;

    const matchesTags = tags.length
      ? tags.every((tag) => post.tags.includes(tag))
      : true;

      const matchesDateRange =
      dateFilter === 'custom' && dateRange?.from && dateRange?.to
        ? new Date(post.pubdate) >= dateRange.from &&
          new Date(post.pubdate) <= dateRange.to
        : true;

    return matchesCategory && matchesTags && (dateFilter !== 'custom' || matchesDateRange);
  })
  .sort((a, b) => {
    const dateA = new Date(a.pubdate);
    const dateB = new Date(b.pubdate);
    if (dateFilter === 'latest') return dateB.getTime() - dateA.getTime();
    if (dateFilter === 'oldest') return dateA.getTime() - dateB.getTime();
    return 0;
  });

  const allCategories = [...new Set(posts.map((p) => p.category))];
  const allTags = [...new Set(posts.flatMap((p) => p.tags))];

  return (
    <div className="w-full bg-white flex flex-col justify-center items-center">
    <div
      className="w-full max-w-[1120px] px-8 pt-2 pb-10 gap-4 flex flex-col justify-center items-center sm:pt-4 sm:pb-12 md:pt-8 md:pb-16 sm:gap-6"
    >
    
    <div className="w-full flex justify-between items-center relative">
      <h2 className="p-0 text-transparent bg-clip-text bg-gradient-to-t from-black to-[#a6a6a6]">
        Popular Posts
      </h2>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="p-2 border-1 border-primary/60 rounded hover:bg-gray-100"
      >
        {showFilters ? <X /> : <ListFilter />}
      </button>

      {showFilters && (
        <div className="absolute right-0 top-14 w-72 bg-white border rounded-lg shadow-lg p-4 z-10">
          <h3 className="text-lg font-light mb-4 bg-primary/95 text-primary-foreground flex justify-center rounded-lg leading-[100%] tracking-normal pb-2">Filter</h3>

          {/* Category Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>  {/* changed from "" to "all" */}
                {allCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Filter */}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Date</label>
            <Select value={dateFilter}onValueChange={(val) => {
                setDateFilter(val);
                setVisibleCount(6);
              }}>
              <SelectTrigger>
                <SelectValue placeholder="Select date filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dateFilter === 'custom' && (
            <div className="mt-3">
              <DatePickerWithRange date={dateRange} setDate={setCustomRange} />
            </div>
          )}
        </div>
      )}
    </div>
      <div className="flex flex-row flex-wrap justify-center gap-6 sm:justify-start">
        {filteredPosts.slice(0, visibleCount).map((post, index) => (
          <a
          key={index}
          href={`/${post.id}`}
          className="w-full flex-[1_0_280px] min-w-70 max-w-90 bg-white p-4 flex flex-col gap-5 rounded-2xl shadow-md hover:shadow-lg border-2 border-secondary-300"
        >
          <img
            src={post.imageSrc}
            alt={post.alt}
            width="400"
            height="225"
            loading="eager"
            className="rounded-xl aspect-16/9 border-1 overflow-hidden object-cover object-bottom"
          />
          <div className="flex flex-col gap-2">
            <p className="font-bold text-md text-transparent bg-clip-text bg-linear-to-t from-orange-500 to-orange-500 py-0 capitalize">{post.category}</p>
            
            <h3 className="text-2xl font-bold py-0 line-clamp-2 overflow-hidden text-ellipsis">
                  {post.title}
                </h3>
            <p
              className="text-base text-justify py-0 line-clamp-3 overflow-hidden text-ellipsis"
            >
              {post.desc}
            </p>
            <p className="text-gray-600 text-sm">{format(new Date(post.pubdate), 'MMMM d, yyyy')}
              </p><div className="text-sm text-gray-500 flex flex-wrap gap-1">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-gray-200 rounded px-2 py-0.5 text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          </a>
        ))}
      </div>
      {visibleCount < filteredPosts.length && (
        <div className="mt-6 text-center w-full">
          <button
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="px-6 py-2 bg-secondary-foreground text-secondary rounded-lg hover:bg-secondary-foreground/90 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  </div>
  );
}
