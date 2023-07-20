import { useProblemsQuery } from '@/query/problems/useProblemsQuery';
import React from 'react';

type Props = {};

export default function Problems({}: Props) {
  const { problems } = useProblemsQuery({ suspense: true });
  return <div>Problems</div>;
}
