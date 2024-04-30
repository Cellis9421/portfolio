import Header from '@/components/Header/Header';
import React from 'react';
import Blog from '../../../@types/IBlog';

interface BlogListProps {
    blogs: Blog[];
}

const BlogList: React.FC<BlogListProps> = ({ blogs }) => {
    return (
        <div>
            {blogs?.map(({ title, content }, index) => (
                <div key={index}>
                    <Header as='h2'>{title}</Header>
                    <p>{content}</p>
                </div>
            ))}
        </div>
    );
};

export default BlogList;